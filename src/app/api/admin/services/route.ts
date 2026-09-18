import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const services = await db.services.findMany(false);
  return NextResponse.json({ success: true, services });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    const service = await db.services.create({
      slug,
      title: body.title,
      description: body.description,
      icon: body.icon || "Code2",
      features: Array.isArray(body.features) ? body.features : [],
      startingPrice: body.startingPrice || "₹4,999",
      published: body.published !== undefined ? body.published : true,
      order: body.order !== undefined ? Number(body.order) : 0,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create service";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
