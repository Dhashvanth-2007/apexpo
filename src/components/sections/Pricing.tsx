"use client";

import React from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle, RefreshCw } from "lucide-react";
import { PRICING_PLANS, MONTHLY_SUPPORT_PLANS, PRICING_NOTE } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="relative py-32 px-6 md:px-12 bg-[#05060A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Transparent Investment"
          title="Engineered pricing based on"
          highlightedTitle="project complexity"
          description="Transparent baseline pricing tailored to your technical requirements and business goals, not arbitrary page counts."
        />

        {/* Pricing Note Alert Banner */}
        <div className="max-w-3xl mx-auto mb-16 p-4 sm:p-5 rounded-2xl bg-surface-glass border border-accent-secondary/30 backdrop-blur-md flex items-start gap-3 shadow-[0_0_20px_rgba(0,229,199,0.08)]">
          <HelpCircle className="w-5 h-5 text-accent-secondary shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
            <strong className="text-white font-semibold">Pricing Note: </strong>
            {PRICING_NOTE}
          </p>
        </div>

        {/* 4-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl",
                plan.featured
                  ? "bg-[#0d1124] border-2 border-accent-secondary shadow-[0_0_45px_rgba(0,229,199,0.25)] lg:-translate-y-3 z-10"
                  : "bg-surface-glass border border-border-glass hover:border-white/20 hover:-translate-y-1.5"
              )}
            >
              {/* Featured Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-accent text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,199,0.6)]">
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  {plan.featured && <Sparkles className="w-4 h-4 text-accent-secondary" />}
                </div>

                <p className="text-xs text-text-muted font-light leading-relaxed mb-6 min-h-[36px]">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-border-glass">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {plan.priceDisplay}
                  </div>
                  <span className="text-[10px] text-text-subtle font-medium uppercase tracking-wider block mt-1">
                    Baseline floor · Scales with complexity
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
                    Included Features:
                  </p>
                  {plan.features.map((feature, fIdx) => {
                    const isLifetime = feature.includes("Lifetime Free Service");
                    return (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <div
                          className={cn(
                            "mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0",
                            isLifetime ? "bg-accent-secondary/20" : "bg-white/[0.06]"
                          )}
                        >
                          <Check
                            className={cn(
                              "w-2.5 h-2.5",
                              isLifetime ? "text-accent-secondary" : "text-white/80"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "leading-tight",
                            isLifetime ? "text-accent-secondary font-semibold" : "text-text-muted"
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={`/contact?budget=${encodeURIComponent(plan.id)}`}
                className={cn(
                  "w-full py-3 rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5",
                  plan.featured
                    ? "bg-gradient-accent text-black shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:shadow-[0_0_30px_rgba(0,229,199,0.7)] hover:scale-[1.02]"
                    : "bg-surface-glass border border-border-glass text-white hover:bg-white/10 hover:border-white/30"
                )}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight size={13} />
              </a>
            </div>
          ))}
        </div>

        {/* Separate Monthly Support Row */}
        <div className="mt-8 pt-12 border-t border-border-glass">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-glass border border-border-glass text-[11px] font-bold uppercase tracking-wider text-accent-secondary mb-2">
              <RefreshCw size={12} className="animate-spin-slow" />
              <span>Recurring Add-On</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Monthly Support & Growth Retainers
            </h3>
            <p className="text-xs text-text-muted max-w-xl mx-auto mt-2 font-light">
              Optional monthly maintenance and proactive growth packages to continuously scale your search visibility, security, and lead volume post-launch.
            </p>
          </div>

          {/* Compact 3-Column Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MONTHLY_SUPPORT_PLANS.map((support) => (
              <div
                key={support.id}
                className="p-6 rounded-2xl bg-surface-glass border border-border-glass hover:border-accent-primary/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(108,92,231,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-white group-hover:text-accent-primary transition-colors">
                      {support.name}
                    </h4>
                    <span className="text-sm font-black text-gradient-purple">
                      {support.price}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted font-light mb-4 leading-relaxed">
                    {support.description}
                  </p>

                  <div className="space-y-1.5 mb-6 pt-3 border-t border-border-glass/60">
                    {support.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-text-muted">
                        <Check size={12} className="text-accent-secondary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="/contact?budget=maintenance"
                  className="w-full py-2.5 rounded-lg bg-white/[0.04] border border-border-glass hover:border-accent-primary text-xs font-semibold text-white text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Add Monthly Retainer</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
