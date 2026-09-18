"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, Sparkles, Check, Dumbbell, UtensilsCrossed, ShoppingBag, BarChart2, UserCheck, CalendarDays, GraduationCap } from "lucide-react";
import { PORTFOLIO, PortfolioItem } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";

const PORTFOLIO_CATEGORIES = [
  "All",
  "Gym",
  "Restaurant",
  "Shop",
  "Marketing",
  "Portfolio",
  "Events",
  "School",
] as const;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  Shop: ShoppingBag,
  Marketing: BarChart2,
  Portfolio: UserCheck,
  Events: CalendarDays,
  School: GraduationCap,
};

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const filteredProjects = PORTFOLIO.filter((p) =>
    activeCategory === "All" ? true : p.category === activeCategory
  );

  const getFrameUrl = (frameNumber: number) => {
    const padded = String(frameNumber).padStart(3, "0");
    return `/assets/frames/ezgif-frame-${padded}.jpg`;
  };

  return (
    <section id="portfolio" className="relative py-32 px-6 md:px-12 bg-[#05060A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Our Work"
          title="Engineered for"
          highlightedTitle="conversion & distinction"
          description="Explore our industry-specific flagship builds spanning high-energy fitness platforms, Michelin-level restaurant flagships, headless e-commerce, and modern K-12 school portals."
        />

        {/* Filter Pills (All, Gym, Restaurant, Shop, Marketing, Portfolio, Events, UI/UX) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5",
                activeCategory === cat
                  ? "bg-gradient-accent text-black shadow-[0_0_20px_rgba(0,229,199,0.5)] scale-105 font-bold"
                  : "bg-surface-glass text-text-muted hover:text-white border border-border-glass hover:border-white/20"
              )}
            >
              {cat !== "All" && CATEGORY_ICONS[cat] && (
                React.createElement(CATEGORY_ICONS[cat], { size: 13 })
              )}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => {
              const CategoryIcon = CATEGORY_ICONS[project.category] || Sparkles;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-surface-glass border border-border-glass hover:border-accent-secondary/50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,229,199,0.2)] hover:-translate-y-2 flex flex-col"
                >
                  {/* Project Cover Visual */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D18]">
                    <img
                      src={project.imageUrl || getFrameUrl(project.frameNumber)}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-black/30 opacity-85 group-hover:opacity-60 transition-opacity" />

                    {/* Category Pill & Live Badge on image */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-accent-secondary">
                        <CategoryIcon size={12} />
                        <span>{project.category}</span>
                      </div>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent-secondary text-black shadow-[0_0_15px_rgba(0,229,199,0.7)] hover:scale-105 transition-transform"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                          <span>Live Site ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Hover icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-xs text-text-subtle font-medium uppercase tracking-wider block mb-1">
                        {project.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-secondary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-text-muted font-light line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Key Feature Bullets */}
                    <div className="space-y-1.5 pt-3 mb-4 border-t border-border-glass/60">
                      {project.keyFeatures.slice(0, 2).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-text-muted">
                          <Check size={12} className="text-accent-secondary shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags & Direct Live Link */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-glass">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-accent-secondary hover:underline flex items-center gap-1 shrink-0 ml-1"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-3xl rounded-3xl bg-[#090C16] border border-border-glass p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Modal Visual */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-border-glass">
                  <img
                    src={selectedProject.imageUrl || getFrameUrl(selectedProject.frameNumber)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-accent-secondary/40 text-accent-secondary text-sm font-bold">
                    {selectedProject.subtitle}
                  </div>
                </div>

                {/* Modal Content */}
                <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
                  Category: {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-light mb-6">
                  {selectedProject.description}
                </p>

                {/* Key Engineered Features */}
                <div className="mb-6 p-5 rounded-xl bg-surface-glass border border-border-glass">
                  <span className="text-xs font-bold uppercase tracking-wider text-white block mb-3">
                    Key Deliverables & Engineered Features
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProject.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-text-primary">
                        <Check size={14} className="text-accent-secondary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs bg-white/10 text-white font-medium border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Live Vercel Host Banner if present */}
                {selectedProject.liveUrl && (
                  <div className="mb-6 p-4 rounded-2xl bg-accent-secondary/10 border border-accent-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-secondary animate-ping" />
                      <div>
                        <span className="text-xs font-bold text-white block">Production Live Host:</span>
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent-secondary hover:underline font-mono truncate block max-w-xs sm:max-w-sm"
                        >
                          {selectedProject.liveUrl}
                        </a>
                      </div>
                    </div>
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-accent-secondary text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,199,0.5)] hover:scale-105 transition-transform flex items-center gap-1.5 shrink-0"
                    >
                      <span>Launch Live Site</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-glass">
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.5)] hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>Visit Live Website</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <a
                      href="#booking"
                      onClick={() => setSelectedProject(null)}
                      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Build Similar Website
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-3 rounded-full bg-surface-glass border border-border-glass text-xs font-semibold text-text-muted hover:text-white transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
