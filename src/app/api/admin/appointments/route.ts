import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "ALL";
  const date = searchParams.get("date") || undefined;
  const filter = (searchParams.get("filter") || "all") as "today" | "upcoming" | "completed" | "cancelled" | "noshow" | "all";

  const appointments = await db.appointments.findMany({
    status: status !== "ALL" ? status : undefined,
    date,
    filter: filter !== "all" ? filter : undefined,
  });

  return NextResponse.json({ success: true, appointments, total: appointments.length });
}
