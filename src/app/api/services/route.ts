import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await db.services.findMany(true);
  return NextResponse.json({ success: true, services });
}
