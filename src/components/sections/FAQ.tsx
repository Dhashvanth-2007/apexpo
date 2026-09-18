"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-32 px-6 md:px-12 bg-[#05060A]">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Questions & Clarity"
          title="Frequently asked"
          highlightedTitle="technical questions"
          description="Everything you need to know about our engineering methodology, project phases, and operational commitments."
        />

        <div className="space-y-4 mt-12">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={cn(
                  "rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden",
                  isOpen
                    ? "bg-surface-glass border-accent-secondary/50 shadow-[0_0_25px_rgba(0,229,199,0.1)]"
                    : "bg-surface-glass/60 border-border-glass hover:border-white/20"
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white shrink-0 transition-transform duration-300",
                      isOpen ? "rotate-180 bg-accent-secondary text-black" : ""
                    )}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-7 pb-7 pt-2 text-sm text-text-muted leading-relaxed font-light border-t border-border-glass/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
