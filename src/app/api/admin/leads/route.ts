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
  const service = searchParams.get("service") || "ALL";
  const budget = searchParams.get("budget") || "ALL";
  const search = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") || "newest") as "newest" | "oldest";

  const leads = await db.leads.findMany({
    status,
    service,
    budget,
    search,
    sort,
  });

  const counts = await db.leads.countByStatus();

  return NextResponse.json({
    success: true,
    leads,
    counts,
    total: leads.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.phone || !body.service) {
      return NextResponse.json({ error: "Missing required fields (name, email, phone, service)" }, { status: 400 });
    }

    const lead = await db.leads.create({
      name: body.name,
      businessName: body.businessName || "Direct Inquiry",
      email: body.email,
      phone: body.phone,
      service: body.service,
      budget: body.budget || "Not Specified",
      message: body.message || "Created directly by APEXPO team",
      notes: body.notes || null,
      assignedToId: body.assignedToId || null,
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create lead";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
