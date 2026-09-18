import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Terminal, Shield, Zap, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

export const metadata: Metadata = {
  title: "About APEXPO — Digital Engineering & Software Studio",
  description: "Learn how APEXPO designs and engineers cinematic, high-performance web applications and software platforms that move businesses forward.",
};

const PROCESS_STEPS = [
  {
    num: "01",
    title: "DISCOVER",
    subtitle: "Strategic Ingestion & Goals",
    desc: "We analyze your competitive landscape, user psychology, conversion bottlenecks, and technical prerequisites to establish uncompromising benchmarks.",
  },
  {
    num: "02",
    title: "PLAN",
    subtitle: "Architecture & Wireframing",
    desc: "We map user journeys, database schemas, API contracts, and conversion funnels to ensure zero architectural debt before writing a single line of code.",
  },
  {
    num: "03",
    title: "DESIGN",
    subtitle: "Cinematic High-Tech UI/UX",
    desc: "Rooted in dark elegance, micro-interactions, fluid typography, and bespoke motion graphics that captivate visitors from the first viewport paint.",
  },
  {
    num: "04",
    title: "DEVELOP",
    subtitle: "Full-Stack Precision Engineering",
    desc: "Built with Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and GSAP/Framer Motion kinetics for sub-second page delivery.",
  },
  {
    num: "05",
    title: "TEST",
    subtitle: "Multi-Device & Stress QA",
    desc: "Rigorous testing across 320px–4K displays, Lighthouse 95+ Core Web Vitals validation, cross-browser audits, and penetration checks.",
  },
  {
    num: "06",
    title: "LAUNCH",
    subtitle: "Zero-Downtime Deployment",
    desc: "Seamless edge deployment to production infrastructure, automated SSL provisioning, Google Search Console indexing, and telemetry tag sync.",
  },
  {
    num: "07",
    title: "GROW",
    subtitle: "Lifetime Care & Optimization",
    desc: "Continuous organic rank advancement, conversion rate optimization, and our signature Lifetime Free Service security patching guarantee.",
  },
];

const VALUES = [
  {
    title: "Zero Compromise on Speed",
    desc: "We don't build sluggish templates. Every digital experience is engineered for sub-second initial paint and instant interactivity.",
    icon: Zap,
  },
  {
    title: "High-Tech Dark Elegance",
    desc: "Our design language reflects modern luxury: obsidian surfaces, electric cyan & violet accents, and tactile micro-interactions.",
    icon: Sparkles,
  },
  {
    title: "Direct Partner Access",
    desc: "You always communicate directly with founding engineers and architects — never routed through junior account representatives.",
    icon: Terminal,
  },
  {
    title: "Lifetime Free Service",
    desc: "We back every build with complimentary lifetime security patches, critical updates, and domain monitoring with zero retainers.",
    icon: Shield,
  },
];

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Our Story & Philosophy"
          title="We build digital experiences that"
          highlightedTitle="move businesses forward"
          description="APEXPO is a premier digital technology and software solutions studio. We bridge high-concept cinematic design with relentless full-stack engineering."
        />

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-20 items-center">
          <div className="lg:col-span-6 space-y-6 text-sm text-text-muted font-light leading-relaxed">
            <p className="text-lg text-white font-medium">
              Most agency websites look like generic templates or cluttered dashboards. We set out to change that.
            </p>
            <p>
              At APEXPO, we treat every website, mobile app, and web platform as a high-stakes digital flagship. We combine the visceral beauty of interactive film with the rock-solid reliability of enterprise software.
            </p>
            <p>
              Whether we are building a Michelin-level culinary web flagship, a zero-lag gaming hardware showcase, or an institutional academy portal — our mission is singular: to engineer digital prestige that turns casual visitors into high-value clients.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface-glass border border-border-glass hover:border-accent-secondary/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-light">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated Process Timeline */}
        <div className="mt-28">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary block mb-2">
              Our 7-Stage Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              The Engineering Process
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto font-light mt-2">
              From exploratory discovery to lifelong post-launch growth — how we deliver flawless execution every time.
            </p>
          </div>

          <div className="relative border-l border-accent-secondary/30 ml-4 md:ml-32 space-y-12 pb-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="relative pl-8 md:pl-12 group">
                {/* Node indicator */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#05060A] border-2 border-accent-secondary flex items-center justify-center text-[11px] font-black text-accent-secondary shadow-[0_0_15px_rgba(0,229,199,0.5)] group-hover:scale-110 group-hover:bg-accent-secondary group-hover:text-black transition-all">
                  {step.num}
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-surface-glass border border-border-glass hover:border-accent-secondary/40 backdrop-blur-xl transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-secondary transition-colors">
                      {step.title}
                    </h3>
                    <span className="text-xs font-mono text-accent-secondary font-bold uppercase tracking-wider">
                      {step.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner (Section 42 in requirements) */}
        <div className="mt-28 p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-[#0A0D1B] to-accent-secondary/20 border border-border-glass text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary mb-3">
            Ready to Begin?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            LET&apos;S BUILD SOMETHING THAT MATTERS.
          </h2>
          <p className="text-sm text-text-muted max-w-xl font-light mb-8 leading-relaxed">
            Have an idea, business or project? Let&apos;s turn it into a powerful digital experience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.5)] hover:scale-105 transition-transform"
            >
              START A PROJECT
            </Link>
            <Link
              href="/book-a-call"
              className="px-8 py-4 rounded-full bg-surface-glass border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:border-white transition-colors"
            >
              BOOK A CALL
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
