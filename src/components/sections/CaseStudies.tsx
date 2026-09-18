"use client";

import React from "react";
import { CASE_STUDIES } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { ArrowUpRight, TrendingUp, CheckCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const CaseStudies: React.FC = () => {
  const getFrameUrl = (frameNumber: number) => {
    const padded = String(frameNumber).padStart(3, "0");
    return `/assets/frames/ezgif-frame-${padded}.jpg`;
  };

  return (
    <section id="case-studies" className="relative py-32 px-6 md:px-12 bg-[#05060A]/90 border-t border-border-glass">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Case Studies"
          title="Deep dive into"
          highlightedTitle="measurable outcomes"
          description="Behind every cinematic interface is an obsession with commercial conversion metrics, reduced friction, and engineered scalability."
        />

        <div className="flex flex-col gap-24 mt-16">
          {CASE_STUDIES.map((study, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={study.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center p-8 sm:p-12 rounded-3xl bg-surface-glass border border-border-glass backdrop-blur-2xl relative overflow-hidden",
                  isEven ? "lg:flex-row-reverse" : ""
                )}
              >
                {/* Background ambient lighting */}
                <div
                  className={cn(
                    "absolute w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20",
                    isEven
                      ? "top-0 right-0 bg-accent-secondary"
                      : "bottom-0 left-0 bg-accent-primary"
                  )}
                />

                {/* Visual / Image Block (5 cols) */}
                <div
                  className={cn(
                    "lg:col-span-5 relative group overflow-hidden rounded-2xl border border-border-glass aspect-[4/3] bg-[#090C16]",
                    isEven ? "lg:order-2" : "lg:order-1"
                  )}
                >
                  <img
                    src={getFrameUrl(study.frameNumber)}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-white">
                      {study.industry}
                    </span>
                  </div>
                </div>

                {/* Editorial Content Block (7 cols) */}
                <div
                  className={cn(
                    "lg:col-span-7 flex flex-col justify-center",
                    isEven ? "lg:order-1" : "lg:order-2"
                  )}
                >
                  <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-accent-secondary mb-2 block">
                    {study.client}
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight">
                    {study.title}
                  </h3>

                  {/* Problem & Solution Accordion-like cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldAlert size={15} />
                        <span>The Challenge</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed font-light">
                        {study.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-accent-secondary/30">
                      <div className="flex items-center gap-2 text-accent-secondary text-xs font-bold uppercase tracking-wider mb-2">
                        <CheckCircle size={15} />
                        <span>The Engineering</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed font-light">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-black/40 border border-border-glass mb-6">
                    {study.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black text-gradient-purple">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-text-subtle font-medium uppercase tracking-wider mt-0.5">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-secondary hover:text-white transition-colors group"
                  >
                    <span>Request Full Case Breakdown</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
