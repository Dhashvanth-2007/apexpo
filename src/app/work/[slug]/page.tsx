import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Sparkles, Layers, Cpu } from "lucide-react";
import { db } from "@/lib/db";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await db.projects.findBySlug(params.slug);
  if (!project) return { title: "Project Not Found | APEXPO" };
  return {
    title: `${project.name} | APEXPO Case Study`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await db.projects.findBySlug(params.slug);
  if (!project) notFound();

  return (
    <main className="pt-28 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-subtle hover:text-accent-secondary transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Work</span>
          </Link>
        </div>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-secondary/15 border border-accent-secondary/40 text-accent-secondary">
            {project.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/10 border border-white/10 text-text-muted">
            {project.clientOrConcept}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-text-muted font-light leading-relaxed mb-10 max-w-3xl">
          {project.description}
        </p>

        {/* Hero Visual */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 border border-border-glass shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <img
            src={project.heroImage}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Metrics & Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-surface-glass border border-border-glass">
            <span className="text-xs font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Project Classification
            </span>
            <p className="text-sm font-semibold text-white">{project.clientOrConcept}</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-glass border border-border-glass">
            <span className="text-xs font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Delivered Services
            </span>
            <p className="text-sm font-semibold text-accent-secondary">
              {project.services.join(", ")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-glass border border-border-glass">
            <span className="text-xs font-bold uppercase tracking-wider text-text-subtle block mb-1">
              Engineered Results
            </span>
            <p className="text-sm font-semibold text-white">
              {project.results || "Sub-second speed & conversion architecture"}
            </p>
          </div>
        </div>

        {/* Case Study Sections */}
        <div className="space-y-12">
          {/* Architectural Overview */}
          <section className="p-8 rounded-3xl bg-surface-glass border border-border-glass backdrop-blur-xl">
            <div className="flex items-center gap-2 text-accent-secondary mb-3">
              <Layers size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Architectural Breakdown & Solution
              </h2>
            </div>
            <p className="text-sm text-text-muted leading-relaxed font-light mb-6">
              This flagship experience was engineered from the ground up to solve critical conversion friction and high latency. We implemented modern Next.js server-side rendering, instant fluid layouts, and kinetic micro-interactions to create an unforgettable digital impression.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.services.map((svc, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-text-primary">
                  <CheckCircle2 size={15} className="text-accent-secondary shrink-0" />
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Technologies Used */}
          <section className="p-8 rounded-3xl bg-surface-glass border border-border-glass backdrop-blur-xl">
            <div className="flex items-center gap-2 text-accent-primary mb-3">
              <Cpu size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Technology Stack
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-4">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-medium text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-[#090C16] to-accent-secondary/20 border border-border-glass text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary mb-2">
            Inspired by this build?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Let&apos;s engineer something extraordinary for your business.
          </h2>
          <p className="text-xs text-text-muted max-w-md font-light mb-8">
            Tell us about your brand targets and desired timeline. An engineering partner will review your brief within 2 business hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.5)] hover:scale-105 transition-transform"
            >
              START A PROJECT
            </Link>
            <Link
              href="/book-a-call"
              className="px-8 py-3.5 rounded-full bg-surface-glass border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:border-white transition-colors"
            >
              BOOK A CALL
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
