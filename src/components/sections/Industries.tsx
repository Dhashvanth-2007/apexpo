"use client";

import React from "react";
import { INDUSTRIES } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import {
  Shield,
  Gem,
  Terminal,
  Building2,
  Activity,
  Compass,
  Zap,
  Briefcase,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Gem,
  Terminal,
  Building2,
  Activity,
  Compass,
  Zap,
  Briefcase,
};

export const Industries: React.FC = () => {
  return (
    <section id="industries" className="relative py-28 overflow-hidden bg-[#05060A]/80 border-y border-border-glass">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-14">
        <SectionHeader
          eyebrow="Market Verticals"
          title="Transforming high-stakes"
          highlightedTitle="industries globally"
          description="We tailor technical architecture, conversion funnels, and interactive visual aesthetics specifically to the regulatory and psychological demands of your domain."
        />
      </div>

      {/* Infinite Horizontal Marquee Track 1 (Left to Right) */}
      <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused] mb-6">
        {[...INDUSTRIES, ...INDUSTRIES].map((ind, idx) => {
          const Icon = ICON_MAP[ind.iconName] || Zap;
          return (
            <div
              key={`track1-${ind.id}-${idx}`}
              className="w-[320px] sm:w-[380px] p-6 rounded-2xl bg-surface-glass border border-border-glass hover:border-accent-secondary/50 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(0,229,199,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/30 flex items-center justify-center text-accent-secondary group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-secondary/80">
                    Proven Track Record
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent-secondary transition-colors">
                  {ind.name}
                </h4>
                <p className="text-xs text-text-muted font-light leading-relaxed mb-4">
                  {ind.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-border-glass flex items-center justify-between">
                <span className="text-[11px] text-text-subtle">Key Benchmark</span>
                <span className="text-xs font-extrabold text-white">{ind.metrics}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Horizontal Marquee Track 2 (Right to Left) */}
      <div className="flex w-max gap-6 animate-marquee-reverse hover:[animation-play-state:paused]">
        {[...INDUSTRIES.slice().reverse(), ...INDUSTRIES.slice().reverse()].map((ind, idx) => {
          const Icon = ICON_MAP[ind.iconName] || Zap;
          return (
            <div
              key={`track2-${ind.id}-${idx}`}
              className="w-[320px] sm:w-[380px] p-6 rounded-2xl bg-surface-glass border border-border-glass hover:border-accent-primary/50 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(108,92,231,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary/80">
                    Domain Specialized
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">
                  {ind.name}
                </h4>
                <p className="text-xs text-text-muted font-light leading-relaxed mb-4">
                  {ind.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-border-glass flex items-center justify-between">
                <span className="text-[11px] text-text-subtle">Average Result</span>
                <span className="text-xs font-extrabold text-white">{ind.metrics}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
