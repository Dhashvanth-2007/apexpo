"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles, Check, Dumbbell, UtensilsCrossed, ShoppingBag, BarChart2, UserCheck, CalendarDays, GraduationCap, Code2 } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";

const WORK_CATEGORIES = [
  "ALL",
  "WEBSITES",
  "MOBILE APPS",
  "WEB APPS",
  "E-COMMERCE",
  "EVENTS",
  "UI/UX",
  "AI",
] as const;

interface WorkItem {
  id: string;
  slug: string;
  name: string;
  category: "WEBSITES" | "MOBILE APPS" | "WEB APPS" | "E-COMMERCE" | "EVENTS" | "UI/UX" | "AI";
  typeBadge: "Concept Project" | "Live Demo";
  description: string;
  services: string[];
  technologies: string[];
  heroImage: string;
  liveUrl?: string;
  metrics: string;
}

const PROJECTS: WorkItem[] = [
  {
    id: "proj-1",
    slug: "vanguard-athletic-club",
    name: "Vanguard Athletic Club & Studios",
    category: "WEBSITES",
    typeBadge: "Concept Project",
    description: "High-octane dark UI engineered for premium fitness clubs. Features integrated real-time class booking schedules, instant membership subscription CTAs, trainer rosters, and live gym capacity meters.",
    services: ["Responsive Web Development", "UI/UX Design", "Booking Engine Architecture"],
    technologies: ["Next.js 14", "Tailwind CSS", "Framer Motion", "TypeScript"],
    heroImage: "/assets/vanguard-cover.png",
    metrics: "+240% mobile class bookings, sub-second latency",
  },
  {
    id: "proj-2",
    slug: "spice-route-restaurant",
    name: "Spice Route — Royal Indian Fine Dining",
    category: "WEBSITES",
    typeBadge: "Live Demo",
    description: "Royal Indian fine dining web flagship live on Vercel. Features authentic saffron-infused royal tasting menus, interactive reservation booking engine, immersive culinary photography gallery, and imperial Indian hospitality.",
    services: ["Web Development", "Interactive Menu Architecture", "Reservation System"],
    technologies: ["Next.js App Router", "Tailwind CSS", "Vercel"],
    heroImage: "/assets/spice-route-cover.png",
    liveUrl: "https://restaurent-lovat-ten.vercel.app/",
    metrics: "Live on Vercel with 100% reservation uplift",
  },
  {
    id: "proj-3",
    slug: "kohaku-japanese-streetwear",
    name: "Kōhaku Japanese Streetwear Flagship",
    category: "E-COMMERCE",
    typeBadge: "Concept Project",
    description: "Ultra-fast headless digital boutique with fluid product grids, instant size/color switchers, frictionless sliding cart drawers, and one-tap Apple Pay / Google Pay checkout flows.",
    services: ["Headless E-Commerce", "UI/UX Design", "Checkout Flow Optimization"],
    technologies: ["NextCommerce", "Shopify API", "Framer Motion", "Tailwind CSS"],
    heroImage: "/assets/kohaku-cover.png",
    metrics: "+65% cart conversion, 0.4s page transitions",
  },
  {
    id: "proj-4",
    slug: "vortex-x1-gaming",
    name: "Vortex X-1 — Hyperlight Gaming",
    category: "E-COMMERCE",
    typeBadge: "Live Demo",
    description: "High-octane product launch showcase & marketing experience for Vortex X-1 Hyperlight Gaming. Features interactive exploded hardware views, 0.2ms QuantumSync zero-lag wireless benchmarks, 120H battery specs, and high-conversion buy-now CTAs.",
    services: ["Campaign Landing Page", "3D Interactive Showcase", "Checkout Flow"],
    technologies: ["Next.js", "GSAP ScrollTrigger", "Tailwind CSS"],
    heroImage: "/assets/vortex-cover.png",
    liveUrl: "https://vortex-one-chi.vercel.app/",
    metrics: "Live on Vercel with 4.8x visitor dwell time",
  },
  {
    id: "proj-5",
    slug: "kai-soren-spatial-director",
    name: "Kai Soren — Spatial Director",
    category: "UI/UX",
    typeBadge: "Concept Project",
    description: "A kinetic personal branding platform designed for top students, elite professionals, and creative influencers. Features smooth showreel video overlays, interactive resume timelines, and social media hubs.",
    services: ["Personal Branding Platform", "Kinetic Animations", "UI/UX Tokens"],
    technologies: ["GSAP Kinetics", "Next.js", "Tailwind CSS"],
    heroImage: "/assets/kai-soren-cover.png",
    metrics: "Featured in leading creative design showcases",
  },
  {
    id: "proj-6",
    slug: "apex-summit-2027",
    name: "Apex Summit 2027 — Future of AI",
    category: "EVENTS",
    typeBadge: "Concept Project",
    description: "High-voltage summit landing pad featuring live countdown clocks, multi-track agenda schedules with speaker filters, interactive venue maps, and instant VIP ticketing RSVP CTAs.",
    services: ["Event Web Platform", "VIP RSVP Flow", "Interactive Agenda Schedule"],
    technologies: ["Next.js 14", "Tailwind CSS", "Countdown Engine"],
    heroImage: "/assets/apex-summit-cover.jpg",
    metrics: "Simulated 10,000+ attendee RSVP registration engine",
  },
  {
    id: "proj-7",
    slug: "oakridge-international-academy",
    name: "Oakridge International Academy",
    category: "WEBSITES",
    typeBadge: "Concept Project",
    description: "World-class digital campus portal engineered for prestigious K-12 international academies and preparatory schools. Features interactive 360° virtual campus tours, online student admissions & enrollment, curriculum directories, and parent-student hubs.",
    services: ["School Web Portal", "Admissions Engine", "Virtual Campus Tour"],
    technologies: ["Next.js App Router", "Tailwind CSS", "Student Portal API"],
    heroImage: "/assets/school-cover.jpg",
    metrics: "+180% online student admissions inquiries",
  },
];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [projectList, setProjectList] = useState<WorkItem[]>(PROJECTS);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectList(
            data.projects.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              name: p.name,
              category: p.category as any,
              typeBadge: p.clientOrConcept as any,
              description: p.description,
              services: p.services || [],
              technologies: p.technologies || [],
              heroImage: p.heroImage,
              liveUrl: p.liveUrl || undefined,
              metrics: p.results || "High performance deliverable",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = projectList.filter((p) =>
    activeCategory === "ALL" ? true : p.category === activeCategory
  );

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Cinematic Portfolio"
          title="Digital experiences engineered for"
          highlightedTitle="distinction & conversion"
          description="Explore our industry-specific flagship builds spanning high-energy fitness platforms, luxury culinary experiences, headless e-commerce, and bespoke enterprise systems."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16 mt-8">
          {WORK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                activeCategory === cat
                  ? "bg-gradient-accent text-black shadow-[0_0_20px_rgba(0,229,199,0.5)] scale-105"
                  : "bg-surface-glass text-text-muted hover:text-white border border-border-glass hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="group relative rounded-3xl overflow-hidden bg-surface-glass border border-border-glass hover:border-accent-secondary/50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,229,199,0.15)] hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Cover Visual */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D18]">
                <img
                  src={proj.heroImage}
                  alt={proj.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-black/40 opacity-80 group-hover:opacity-50 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/15 text-accent-secondary">
                    {proj.category}
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                    proj.typeBadge === "Live Demo"
                      ? "bg-accent-secondary text-black border-accent-secondary font-black shadow-[0_0_12px_rgba(0,229,199,0.6)]"
                      : "bg-white/10 text-text-subtle border-white/10"
                  )}>
                    {proj.typeBadge}
                  </span>
                </div>

                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-accent-secondary text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,229,199,0.6)] hover:scale-110 transition-transform"
                    title="Open Live Host"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-secondary transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed font-light line-clamp-3 mb-4">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-text-subtle font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-glass flex items-center justify-between">
                  <Link
                    href={`/work/${proj.slug}`}
                    className="text-xs font-bold text-accent-secondary hover:underline flex items-center gap-1"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight size={13} />
                  </Link>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-text-muted hover:text-white flex items-center gap-1"
                    >
                      <span>Live Site ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
