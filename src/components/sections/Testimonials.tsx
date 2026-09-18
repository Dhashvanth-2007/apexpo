"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-32 px-6 md:px-12 bg-[#05060A]/85 border-t border-border-glass overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Social Proof"
          title="Endorsed by"
          highlightedTitle="visionary founders"
          description="Read how world-class brand leaders and enterprise operators accelerate growth partnering with Apexpo."
        />

        {/* Featured Testimonial Spotlight */}
        <div className="max-w-4xl mx-auto relative mt-8">
          {testimonials.length === 0 ? (
            <div className="relative rounded-3xl p-10 sm:p-16 bg-surface-glass border border-border-glass backdrop-blur-2xl shadow-2xl text-center">
              <Quote className="w-12 h-12 text-accent-secondary/30 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Client stories coming soon.</h4>
              <p className="text-xs text-text-muted max-w-md mx-auto font-light leading-relaxed">
                We believe in 100% genuine social proof. As our live production projects conclude, authentic client ratings and founder reviews will be published here.
              </p>
            </div>
          ) : (
            <div className="relative rounded-3xl p-8 sm:p-14 bg-surface-glass border border-border-glass backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Ambient Watermark Icon */}
              <Quote className="absolute top-6 right-8 w-24 h-24 text-white/[0.03] pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id || 0}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col justify-between min-h-[260px]"
                >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-6 text-yellow-400">
                    {[...Array(current?.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                    <span className="ml-3 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30">
                      {current?.metrics || "Verified Client"}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg sm:text-2xl font-normal text-white leading-relaxed mb-8">
                    &ldquo;{current?.review || current?.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-border-glass">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-accent-secondary/40 shadow-[0_0_15px_rgba(0,229,199,0.3)] bg-black/50 flex items-center justify-center text-accent-secondary font-bold">
                    {current?.image || current?.avatar ? (
                      <img
                        src={current?.image || current?.avatar}
                        alt={current?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{current?.name?.charAt(0) || "C"}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{current?.name}</h4>
                    <p className="text-xs text-text-muted">
                      {current?.role}, <span className="text-accent-secondary">{current?.business || current?.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation Buttons */}
            {testimonials.length > 1 && (
              <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous review"
                  className="p-3 rounded-full bg-white/[0.05] hover:bg-white/15 text-white transition-colors border border-border-glass"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next review"
                  className="p-3 rounded-full bg-white/[0.05] hover:bg-white/15 text-white transition-colors border border-border-glass"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};
