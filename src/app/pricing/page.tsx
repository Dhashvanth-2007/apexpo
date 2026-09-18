import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PRICING_PLANS, MONTHLY_SUPPORT_PLANS, PRICING_NOTE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "APEXPO Pricing — Transparent Project & Feature-Based Packages",
  description: "Explore APEXPO's transparent, complexity-based pricing starting from ₹4,999 with Lifetime Free Service maintenance included with every project.",
};

export default function PricingPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Transparent Investment"
          title="Engineered by complexity & value,"
          highlightedTitle="never by page count"
          description="Every tier is a starting baseline based on project requirements, technical logic, and specialized integrations — backed by our signature Lifetime Free Service guarantee."
        />

        {/* Pricing Notice Callout */}
        <div className="max-w-3xl mx-auto my-12 p-4 rounded-2xl bg-surface-glass border border-accent-secondary/30 flex items-center gap-3 text-xs text-text-muted">
          <Sparkles size={18} className="text-accent-secondary shrink-0" />
          <p className="font-light">
            <strong className="text-white font-semibold">Pricing Note:</strong> Final pricing depends on project requirements and features, not the number of pages. The quote increases transparently when deeper custom logic or integrations are required.
          </p>
        </div>

        {/* 4 Core Project Complexity Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 backdrop-blur-2xl",
                plan.featured
                  ? "bg-[#090D1C] border-2 border-accent-secondary shadow-[0_0_40px_rgba(0,229,199,0.2)] lg:-translate-y-3"
                  : "bg-surface-glass border border-border-glass hover:border-white/20 hover:-translate-y-1"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-accent text-black shadow-[0_0_15px_rgba(0,229,199,0.6)]">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-text-muted font-light mb-6 min-h-[36px]">
                  {plan.tagline}
                </p>

                <div className="mb-8">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {plan.priceDisplay}
                  </span>
                  <span className="block text-[10px] text-text-subtle uppercase tracking-wider mt-1">
                    Baseline Starting Estimate
                  </span>
                </div>

                <div className="space-y-3 pt-6 border-t border-border-glass/60 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                    What&apos;s Included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-muted">
                      <Check size={14} className="text-accent-secondary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/contact?budget=${encodeURIComponent(plan.name)}`}
                className={cn(
                  "w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-center transition-all duration-300",
                  plan.featured
                    ? "bg-gradient-accent text-black shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>

        {/* Monthly Retainer / Maintenance Plans */}
        <div className="mt-28">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary block mb-2">
              Ongoing Care & Growth
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Optional Monthly Retainers
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto font-light mt-2">
              For brands requiring continuous feature iterations, weekly Google Business updates, and SLA turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MONTHLY_SUPPORT_PLANS.map((sp) => (
              <div
                key={sp.id}
                className="rounded-3xl p-8 bg-surface-glass border border-border-glass hover:border-white/20 backdrop-blur-xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{sp.name}</h3>
                  <span className="text-base font-extrabold text-accent-secondary">
                    {sp.price}
                  </span>
                </div>
                <p className="text-xs text-text-muted font-light mb-6">
                  {sp.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-border-glass/60">
                  {sp.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                      <Check size={13} className="text-accent-secondary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifetime Free Service Guarantee Callout */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-[#0A0D1B] to-accent-secondary/20 border border-accent-secondary/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center text-accent-secondary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Apexpo Signature Guarantee: Lifetime Free Service
              </h3>
              <p className="text-xs text-text-muted font-light mt-1 max-w-2xl leading-relaxed">
                Zero retainer lock-in. Every website we build includes complimentary security patches, critical dependency upgrades, and minor content tweaks for life.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:scale-105 transition-transform shrink-0"
          >
            START A PROJECT
          </Link>
        </div>
      </div>
    </main>
  );
}
