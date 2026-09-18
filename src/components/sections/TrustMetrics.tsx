"use client";

import React from "react";
import { motion } from "framer-motion";

export const TrustMetrics: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-r from-[#E52D27] via-[#FF3B30] to-[#E52D27] text-white overflow-hidden shadow-[0_0_50px_rgba(229,45,39,0.3)]">
      {/* Subtle background ambient overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 3 Prominent Floating Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Card 1: 2 weeks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-[#090C15] p-8 sm:p-12 text-center shadow-2xl border border-black/20 flex flex-col items-center justify-center min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
              2 weeks
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Average project kickoff
            </p>
          </motion.div>

          {/* Card 2: 99.9% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-[#090C15] p-8 sm:p-12 text-center shadow-2xl border border-black/20 flex flex-col items-center justify-center min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
              99.9%
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Uptime guarantee
            </p>
          </motion.div>

          {/* Card 3: 24/7 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl bg-[#090C15] p-8 sm:p-12 text-center shadow-2xl border border-black/20 flex flex-col items-center justify-center min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
              24/7
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Support availability
            </p>
          </motion.div>
        </div>

        {/* Tagline text below cards */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-base sm:text-lg md:text-xl font-medium text-white/95 max-w-3xl mx-auto leading-relaxed"
        >
          Built with cutting-edge technology, optimized for performance, and designed to scale with your business growth.
        </motion.p>
      </div>
    </section>
  );
};
