import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await db.projects.findMany(true);
  return NextResponse.json({ success: true, projects });
}
