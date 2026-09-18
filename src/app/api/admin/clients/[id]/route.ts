import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const client = await db.clients.findById(params.id);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Fetch appointments for this client
  const appointments = await db.appointments.findMany({ clientId: params.id });

  // Find associated lead by email
  const leads = await db.leads.findMany({ search: client.email });
  const lead = leads.find((l) => l.email.toLowerCase() === client.email.toLowerCase()) || null;

  return NextResponse.json({ success: true, client, appointments, lead });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { notes, name, companyName, phone } = body;

    const updated = await db.clients.update(params.id, {
      ...(notes !== undefined ? { notes } : {}),
      ...(name ? { name } : {}),
      ...(companyName ? { companyName } : {}),
      ...(phone ? { phone } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/clients/[id] Error]", err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
