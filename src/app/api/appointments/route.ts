import { NextRequest, NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { sendAppointmentNotifications } from "@/lib/email";
import { generateMeetingUrl, CALL_SCOPE_LABELS, CALL_SCOPE_DURATION } from "@/lib/calendar";

// Rate limiting: allow generous limits for legitimate users, bypass for localhost
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_BOOKINGS_PER_WINDOW = 50;

function isRateLimited(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip.includes("localhost")) return false;
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (valid.length >= MAX_BOOKINGS_PER_WINDOW) return true;
  valid.push(now);
  rateLimitMap.set(ip, valid);
  return false;
}

export const dynamic = "force-dynamic";

// GET /api/appointments?date=YYYY-MM-DD — returns available + occupied slots
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const allSlots = db.appointments.getAvailableTimeSlots();

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: true, slots: allSlots, occupied: [] });
  }

  const occupied = await db.appointments.getOccupiedSlots(date);
  const available = allSlots.filter((s) => !occupied.includes(s));

  return NextResponse.json({ success: true, date, slots: allSlots, available, occupied });
}

// POST /api/appointments — submit a booking
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many booking requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = appointmentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, companyName, email, phone, callScope, appointmentDate, appointmentTime, timezone, projectDescription } = parseResult.data;

    // 1. Check slot availability (server-side — frontend check is not enough)
    const slotAvailable = await db.appointments.checkSlotAvailability(appointmentDate, appointmentTime);
    if (!slotAvailable) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another time.", code: "SLOT_TAKEN" },
        { status: 409 }
      );
    }

    // 2. Check for duplicate submission (same email + same date + same time)
    const existingAppts = await db.appointments.findMany({ date: appointmentDate });
    const dupSubmission = existingAppts.find(
      (a) => a.clientEmail.toLowerCase() === email.toLowerCase() && a.appointmentTime === appointmentTime
    );
    if (dupSubmission) {
      return NextResponse.json(
        { error: "You have already booked this slot. Check your email for confirmation.", code: "DUPLICATE" },
        { status: 409 }
      );
    }

    // 3. Find or create client (no duplicates by email)
    let client = await db.clients.findByEmail(email);
    if (!client) {
      client = await db.clients.create({ name, companyName, email, phone });
      console.log(`[Booking] New client created: ${client.id} (${email})`);
    } else {
      console.log(`[Booking] Existing client found: ${client.id} (${email})`);
    }

    // 4. Find or create lead (one lead per email, source = BOOK_A_CALL)
    const existingLeads = await db.leads.findMany({ search: email });
    const existingLead = existingLeads.find((l) => l.email.toLowerCase() === email.toLowerCase());
    let lead = existingLead || null;

    if (!lead) {
      lead = await db.leads.create({
        name,
        businessName: companyName,
        email,
        phone,
        service: `Strategy Call — ${CALL_SCOPE_LABELS[callScope] || callScope}`,
        budget: "Custom Scope / Needs Consultation",
        message: projectDescription || `Booked a ${CALL_SCOPE_LABELS[callScope] || callScope} via Book-a-Call.`,
        notes: null,
        assignedToId: null,
      });
      console.log(`[Booking] New lead created: ${lead.id} (NEW)`);
    } else {
      console.log(`[Booking] Existing lead attached: ${lead.id} (${lead.status})`);
    }

    const duration = CALL_SCOPE_DURATION[callScope] || 45;

    // 5. Generate meeting URL (stub — null until Google Calendar configured)
    const meetingUrl = await generateMeetingUrl({
      summary: `APEXPO Consultation — ${name}`,
      description: `${CALL_SCOPE_LABELS[callScope] || callScope}${projectDescription ? `\n\nProject Information:\n${projectDescription}` : ""}`,
      startDateTime: `${appointmentDate}T${appointmentTime}:00`,
      endDateTime: `${appointmentDate}T${appointmentTime}:00`,
      attendeeEmail: email,
      attendeeName: name,
      timezone,
    });

    // 6. Create appointment
    const appointment = await db.appointments.create({
      clientId: client.id,
      leadId: lead?.id || null,
      callScope,
      duration,
      appointmentDate,
      appointmentTime,
      timezone,
      status: "CONFIRMED",
      meetingUrl,
      projectDescription: projectDescription || null,
      notes: null,
    });

    console.log(`[Booking] Appointment created: ${appointment.id} for client ${client.id} at ${appointmentDate} ${appointmentTime}`);

    // Track analytics
    db.analytics.track("BOOK_CALL_CLICK", "/book-a-call", {
      appointmentId: appointment.id,
      callScope,
      date: appointmentDate,
    }).catch(() => {});

    // 7. Send email notifications (non-blocking)
    sendAppointmentNotifications({
      appointmentId: appointment.id,
      clientName: name,
      companyName,
      email,
      phone,
      callScope,
      callScopeLabel: CALL_SCOPE_LABELS[callScope] || callScope,
      duration,
      appointmentDate,
      appointmentTime,
      timezone,
      meetingUrl,
    }).catch((err) => console.error("[Booking Email Error]", err));

    return NextResponse.json({
      success: true,
      message: "Your strategy session has been confirmed.",
      appointment: {
        id: appointment.id,
        callScope,
        callScopeLabel: CALL_SCOPE_LABELS[callScope] || callScope,
        duration,
        date: appointmentDate,
        time: appointmentTime,
        timezone,
        meetingUrl,
        status: "CONFIRMED",
      },
      client: { id: client.id, name, email },
    }, { status: 201 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another time.", code: "SLOT_TAKEN" },
        { status: 409 }
      );
    }
    console.error("[POST /api/appointments Error]", err);
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}
