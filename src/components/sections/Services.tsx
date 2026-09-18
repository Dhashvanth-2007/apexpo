"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  ShoppingBag,
  Palette,
  Zap,
  Search,
  MapPin,
  BarChart3,
  Flame,
  ShieldCheck,
  TrendingUp,
  Target,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Film,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  ShoppingBag,
  Palette,
  Zap,
  Search,
  MapPin,
  BarChart3,
  Flame,
  ShieldCheck,
  TrendingUp,
  Target,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  Film,
};

const CATEGORIES = [
  "All",
  "Development",
  "Design",
  "Growth & SEO",
  "AI & Performance",
] as const;

export const Services: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredServices = SERVICES.filter((svc) =>
    activeCategory === "All" ? true : svc.category === activeCategory
  );

  return (
    <section id="services" className="relative py-32 px-6 md:px-12 bg-[#05060A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Specialized Capabilities"
          title="Engineered for"
          highlightedTitle="exponential growth"
          description="From modern responsive builds and AI automation to our signature Lifetime Free Service guarantee, we build websites that convert with zero compromises."
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                activeCategory === cat
                  ? "bg-accent-secondary text-black shadow-[0_0_20px_rgba(0,229,199,0.5)] scale-105"
                  : "bg-surface-glass text-text-muted hover:text-white border border-border-glass hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (14 Services) */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => {
              const Icon = ICON_MAP[service.iconName] || Code2;
              const isSpecial = !!service.isSpecial;

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className={cn(
                    "group relative rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl hover:-translate-y-1.5",
                    isSpecial
                      ? "bg-gradient-to-b from-[#141029] to-[#0a1520] border-2 border-accent-secondary shadow-[0_0_40px_rgba(0,229,199,0.25)] md:col-span-2 lg:col-span-3"
                      : "bg-surface-glass border border-border-glass hover:border-accent-secondary/40 hover:shadow-[0_10px_35px_rgba(108,92,231,0.15)]"
                  )}
                >
                  {/* Highlight Banner for Lifetime Free Service */}
                  {isSpecial && (
                    <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-gradient-accent text-black text-[11px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,199,0.8)] flex items-center gap-1.5">
                      <Sparkles size={12} className="fill-black" />
                      <span>Included With Every Single Project</span>
                    </div>
                  )}

                  {/* Subtle hover gradient illumination */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                          isSpecial
                            ? "bg-accent-secondary text-black shadow-[0_0_20px_rgba(0,229,199,0.6)]"
                            : "bg-white/[0.04] border border-border-glass text-accent-secondary group-hover:scale-110 group-hover:bg-accent-secondary/10 group-hover:border-accent-secondary/50"
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] uppercase font-bold tracking-widest",
                          isSpecial
                            ? "text-accent-secondary"
                            : "text-text-subtle group-hover:text-accent-primary"
                        )}
                      >
                        {isSpecial ? "Lifetime Commitment" : service.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={cn(
                        "font-bold mb-3 tracking-tight transition-colors",
                        isSpecial
                          ? "text-2xl sm:text-3xl text-white"
                          : "text-xl text-white group-hover:text-accent-secondary"
                      )}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-muted leading-relaxed font-light mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables checklist */}
                    <div
                      className={cn(
                        "space-y-2 mb-6 pt-4 border-t border-border-glass/60",
                        isSpecial ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 space-y-0" : ""
                      )}
                    >
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-text-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-secondary shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Tags & Action */}
                  <div className="pt-4 border-t border-border-glass flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {service.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "px-2.5 py-0.5 rounded-md text-[10px] font-medium",
                            isSpecial
                              ? "bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30"
                              : "bg-white/[0.04] text-text-subtle"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href="#booking"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-secondary hover:text-white transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>{isSpecial ? "Claim Your Free Service" : "Inquire"}</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
