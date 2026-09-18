import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const testimonials = await db.testimonials.findMany(false);
  return NextResponse.json({ success: true, testimonials });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.business || !body.review) {
      return NextResponse.json({ error: "Name, business, and review are required" }, { status: 400 });
    }

    const testimonial = await db.testimonials.create({
      name: body.name,
      business: body.business,
      role: body.role || "Founder",
      review: body.review,
      image: body.image || null,
      rating: body.rating ? Number(body.rating) : 5,
      metrics: body.metrics || "Verified Client",
      published: body.published !== undefined ? body.published : false,
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create testimonial";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
