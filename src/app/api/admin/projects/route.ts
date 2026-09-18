import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const projects = await db.projects.findMany(false);
  return NextResponse.json({ success: true, projects });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.category || !body.description) {
      return NextResponse.json({ error: "Name, category, and description are required" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    const project = await db.projects.create({
      slug,
      name: body.name,
      category: body.category,
      description: body.description,
      clientOrConcept: body.clientOrConcept || "Concept Project",
      services: Array.isArray(body.services) ? body.services : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      heroImage: body.heroImage || "/assets/placeholder-cover.jpg",
      gallery: Array.isArray(body.gallery) ? body.gallery : [body.heroImage || "/assets/placeholder-cover.jpg"],
      problem: body.problem || null,
      solution: body.solution || null,
      features: Array.isArray(body.features) ? body.features : [],
      results: body.results || null,
      liveUrl: body.liveUrl || null,
      published: body.published !== undefined ? body.published : true,
      order: body.order !== undefined ? Number(body.order) : 0,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
