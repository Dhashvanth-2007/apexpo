import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const appointment = await db.appointments.findById(params.id);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  // Fetch lead by leadId or by client email
  let lead = null;
  if (appointment.leadId) {
    const { lead: l } = await db.leads.findById(appointment.leadId);
    lead = l;
  }
  if (!lead) {
    const leads = await db.leads.findMany({ search: appointment.clientEmail });
    lead = leads.find((l) => l.email.toLowerCase() === appointment.clientEmail.toLowerCase()) || null;
  }

  return NextResponse.json({ success: true, appointment, lead });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { status, notes, meetingUrl, appointmentDate, appointmentTime } = body;

    const validStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW", "RESCHEDULED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await db.appointments.update(params.id, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(meetingUrl !== undefined ? { meetingUrl } : {}),
      ...(appointmentDate ? { appointmentDate } : {}),
      ...(appointmentTime ? { appointmentTime } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // If marked COMPLETED or CANCELLED, sync lead status
    if (status && updated.leadId) {
      const leadStatusMap: Record<string, string> = {
        COMPLETED: "PROPOSAL_SENT",
        CANCELLED: "CONTACTED",
      };
      if (leadStatusMap[status]) {
        await db.leads.update(updated.leadId, { status: leadStatusMap[status] }, auth.admin.name || "Admin");
      }
    }

    console.log(`[Admin] Appointment ${params.id} updated: status=${status || "unchanged"} by ${auth.admin.name}`);

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json({ error: "Selected time slot is already occupied.", code: "SLOT_TAKEN" }, { status: 409 });
    }
    console.error("[PATCH /api/admin/appointments/[id] Error]", err);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
