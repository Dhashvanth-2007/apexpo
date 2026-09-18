import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.eventType) {
      return NextResponse.json({ error: "eventType required" }, { status: 400 });
    }

    await db.analytics.track(body.eventType, body.path || "/", body.metadata || null);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
