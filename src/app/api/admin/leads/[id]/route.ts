import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const result = await db.leads.findById(params.id);
  if (!result.lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    lead: result.lead,
    activities: result.activities,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const updated = await db.leads.update(params.id, body, auth.admin.name);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const full = await db.leads.findById(params.id);
    return NextResponse.json({
      success: true,
      lead: full.lead,
      activities: full.activities,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update lead";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Deleting leads requires SUPER_ADMIN role
  const auth = await requireAdmin(["SUPER_ADMIN"]);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const success = await db.leads.delete(params.id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete lead";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
