import { NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { sendLeadNotifications } from "@/lib/email";

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a minute before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 1. Zod Validation
    const parseResult = leadSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, businessName, email, phone, service, budget, message, honeypot } = parseResult.data;

    // 2. Honeypot check (hidden field to trap automated bot crawlers)
    if (honeypot && honeypot.trim().length > 0) {
      // Quietly succeed to fool bots without storing spam
      return NextResponse.json({ success: true, message: "Project brief received." });
    }

    // 3. Database Persistence
    const lead = await db.leads.create({
      name,
      businessName,
      email,
      phone,
      service,
      budget,
      message,
    });

    // Record telemetry event
    db.analytics.track("CONTACT_SUBMIT", "/contact", { leadId: lead.id, service: lead.service }).catch(() => {});

    // 4. Send Transactional Notifications
    sendLeadNotifications({
      leadId: lead.id,
      name: lead.name,
      businessName: lead.businessName,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      budget: lead.budget,
      message: lead.message,
      createdAt: new Date(lead.createdAt),
    }).catch((err) => console.error("[Background Email Dispatch Error]", err));

    return NextResponse.json({
      success: true,
      message: "Project brief received successfully. An engineering partner will review your requirements.",
      leadId: lead.id,
    });
  } catch (err) {
    console.error("[POST /api/leads Error]", err);
    return NextResponse.json(
      { error: "Internal server error. Please contact our helpline directly if this persists." },
      { status: 500 }
    );
  }
}
