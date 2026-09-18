"use client";

import React from "react";
import { ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";
import { COMPANY_DETAILS } from "@/lib/constants";

interface HeroOverlayProps {
  scrollProgress: number; // 0 to 1
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-16 lg:p-20 pointer-events-none">
      {/* Top spacer for navbar */}
      <div className="h-16" />

      {/* Main hero content container - Left aligned */}
      <div className="w-full flex justify-start items-center my-auto">
        <div 
          className="w-full max-w-xl lg:max-w-2xl text-left flex flex-col items-start pointer-events-auto transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${-scrollProgress * 40}px)`,
            opacity: Math.max(0.2, 1 - scrollProgress * 0.9),
          }}
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-glass border border-accent-secondary/30 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(0,229,199,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-secondary">
              {COMPANY_DETAILS.eyebrow}
            </span>
          </div>

          {/* Big APEXPO Headline */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[7.5rem] xl:text-[9.5rem] font-black tracking-tighter text-white leading-[0.88] mb-4 select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] whitespace-nowrap">
            <span className="bg-gradient-to-br from-white via-[#F5F5F7] to-[#8A8F98] bg-clip-text text-transparent">
              APEXPO
            </span>
          </h1>

          {/* Compact Taglines */}
          <p className="max-w-xl text-base sm:text-lg md:text-xl font-bold tracking-tight text-white mb-2 leading-snug">
            WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.
          </p>
          <p className="text-xs sm:text-sm text-text-muted font-light tracking-normal mb-6 max-w-lg leading-relaxed">
            APEXPO creates high-performance websites, mobile apps, web applications and digital solutions designed for modern businesses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="/contact"
              onClick={() => {
                fetch("/api/analytics/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ eventType: "START_PROJECT_CLICK", path: "/" }),
                }).catch(() => {});
              }}
              className="relative group overflow-hidden px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:shadow-[0_0_30px_rgba(0,229,199,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="/work"
              onClick={() => {
                fetch("/api/analytics/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ eventType: "PORTFOLIO_CLICK", path: "/" }),
                }).catch(() => {});
              }}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-surface-glass border border-border-glass hover:border-white/40 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-300 hover:bg-white/10 flex items-center gap-1.5"
            >
              <span>EXPLORE OUR WORK</span>
            </a>
          </div>

          {/* Compact Inline Stat Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pt-4 border-t border-border-glass/50 w-full">
            <div className="px-2.5 py-1 rounded-lg bg-surface-glass border border-border-glass text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="font-bold text-white">99.9%</span>
              <span className="text-[10px] opacity-70">Uptime SLA</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-surface-glass border border-border-glass text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="font-bold text-accent-secondary">0.3s</span>
              <span className="text-[10px] opacity-70">Latency</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-surface-glass border border-border-glass text-[11px] text-text-muted flex items-center gap-1.5">
              <span className="font-bold text-accent-primary">+210%</span>
              <span className="text-[10px] opacity-70">Lift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div 
        className="w-full flex justify-center items-center pb-4 transition-opacity duration-300 pointer-events-auto"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 5),
        }}
      >
        <a
          href="#services"
          className="flex flex-col items-center gap-2 text-text-muted hover:text-accent-secondary transition-colors group cursor-pointer"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-text-muted group-hover:text-accent-secondary transition-colors">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border border-border-glass flex items-start justify-center p-1 group-hover:border-accent-secondary/60 transition-colors">
            <div className="w-1.5 h-2.5 rounded-full bg-accent-secondary animate-bounce mt-1" />
          </div>
        </a>
      </div>
    </div>
  );
};
