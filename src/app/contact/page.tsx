"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Clock, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { COMPANY_DETAILS, BUDGET_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Full Name must be at least 2 characters"),
  businessName: z.string().trim().min(2, "Business / Company Name is required"),
  email: z.string().trim().email("Please provide a valid work email address"),
  phone: z.string().trim().min(7, "Please provide a valid telephone number"),
  service: z.string().trim().min(1, "Please select what you want to build"),
  budget: z.string().trim().min(1, "Please select an estimated project budget"),
  message: z.string().trim().min(10, "Please provide brief project goals (min 10 characters)"),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CAPABILITY_OPTIONS = [
  "Website Development",
  "Mobile App Development",
  "Web App Development",
  "E-Commerce Development",
  "UI/UX Design",
  "Landing Page Development",
  "Event Website & App",
  "AI Integration & Automation",
  "SEO & Digital Growth",
  "Google Business Optimization",
  "Analytics & Reporting",
  "Website & App Maintenance",
  "Custom Software Solutions",
  "Other / Multi-Platform Scope",
];

const BUDGET_OPTIONS = BUDGET_TIERS;

function findMatchingTier(param: string | null): string {
  if (!param) return "";
  const p = param.toLowerCase();
  if (p.includes("starter")) return "Starter Tier — Starting from ₹4,999";
  if (p.includes("business")) return "Business Tier — Starting from ₹9,999";
  if (p.includes("growth")) return "Growth Tier (Most Popular) — Starting from ₹19,999";
  if (p.includes("custom") || p.includes("enterprise")) return "Custom / Enterprise Solutions — Starting from ₹50,000+";
  if (p.includes("maintain") || p.includes("retainer")) return "Monthly Care & Retainers — Starting from ₹1,499/month";
  const exact = BUDGET_OPTIONS.find((t) => t.toLowerCase().includes(p));
  return exact || "";
}

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialBudgetParam = searchParams.get("budget");

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      budget: findMatchingTier(initialBudgetParam),
    },
  });

  useEffect(() => {
    if (initialBudgetParam) {
      const match = findMatchingTier(initialBudgetParam);
      if (match) {
        setValue("budget", match);
      }
    }
  }, [initialBudgetParam, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl p-8 sm:p-12 bg-surface-glass border border-border-glass backdrop-blur-2xl shadow-2xl relative">
      {submitted ? (
        <div className="py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 flex items-center justify-center mx-auto text-accent-secondary">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Project Brief Transmitted</h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Your inquiry has entered our engineering queue. An APEXPO partner will review your specifications and respond within 2 business hours.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Submit Another Project
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Anti-spam honeypot */}
          <input
            type="text"
            {...register("honeypot")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Your Name *
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Alex Morgan"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                  errors.name ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Business Name */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Business / Entity *
              </label>
              <input
                type="text"
                {...register("businessName")}
                placeholder="Vanguard Studio / Self"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                  errors.businessName ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              />
              {errors.businessName && (
                <p className="text-[10px] text-red-400 mt-1">{errors.businessName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Work Email */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Work Email *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="alex@enterprise.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                  errors.email ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              />
              {errors.email && (
                <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Direct Telephone *
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+91 93427 44740"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                  errors.phone ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              />
              {errors.phone && (
                <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Desired Capability */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                What Are You Building? *
              </label>
              <select
                {...register("service")}
                defaultValue=""
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-[#090C16] border text-white text-xs focus:outline-none transition-colors",
                  errors.service ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              >
                <option value="" disabled>Select Capability</option>
                {CAPABILITY_OPTIONS.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-[10px] text-red-400 mt-1">{errors.service.message}</p>
              )}
            </div>

            {/* Estimated Budget Tier */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Estimated Project Budget *
              </label>
              <select
                {...register("budget")}
                defaultValue=""
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-[#090C16] border text-white text-xs focus:outline-none transition-colors",
                  errors.budget ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
                )}
              >
                <option value="" disabled>Select Budget Tier</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="text-[10px] text-red-400 mt-1">{errors.budget.message}</p>
              )}
            </div>
          </div>

          {/* Project Goals & Context */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
              Project Goals & Context *
            </label>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Tell us about your timeline, targets, and desired deliverables..."
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                errors.message ? "border-red-500" : "border-border-glass focus:border-accent-secondary"
              )}
            />
            {errors.message && (
              <p className="text-[10px] text-red-400 mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.4)] hover:shadow-[0_0_35px_rgba(0,229,199,0.7)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <Send size={14} />
            <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT PROJECT BRIEF"}</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(
    "Hi APEXPO, I would like to discuss a project."
  )}`;

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Initiate Contact"
          title="Let's engineer something"
          highlightedTitle="extraordinary together"
          description="Have an ambitious digital project or redesign? Reach out below and our engineering directors will respond within 2 business hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          {/* Direct channels & SLA info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="rounded-3xl p-6 sm:p-8 bg-surface-glass border border-border-glass backdrop-blur-xl">
                <div className="flex items-center gap-2.5 text-accent-secondary mb-3">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    SLA Response Guarantee
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Direct Partner Access
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-light">
                  No automated ticket bots. Every submission is routed straight to an APEXPO engineering director.
                </p>
                <div className="mt-4 pt-4 border-t border-border-glass/60 flex items-center gap-4 text-[11px] text-text-subtle font-mono">
                  <span>Median Response: 47m</span>
                  <span>·</span>
                  <span>Guaranteed: &lt; 2h</span>
                </div>
              </div>

              {/* Communication Cards */}
              <div className="space-y-3">
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="rounded-2xl p-4 bg-surface-glass border border-border-glass hover:border-accent-secondary/50 transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-secondary group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                      Direct Email
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent-secondary transition-colors font-mono">
                      {COMPANY_DETAILS.email}
                    </span>
                  </div>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl p-4 bg-surface-glass border border-border-glass hover:border-emerald-500/50 transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                      WhatsApp Business (Direct)
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors font-mono">
                      +{COMPANY_DETAILS.whatsappNumber}
                    </span>
                  </div>
                </a>

                <div className="rounded-2xl p-4 bg-surface-glass border border-border-glass flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-secondary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                      Telephone Lines
                    </span>
                    <div className="text-xs sm:text-sm font-semibold text-white font-mono space-x-2">
                      <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:text-accent-secondary">
                        {COMPANY_DETAILS.phone}
                      </a>
                      <span className="text-text-subtle">/</span>
                      <a href={`tel:${COMPANY_DETAILS.secondaryPhone}`} className="hover:text-accent-secondary">
                        {COMPANY_DETAILS.secondaryPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-surface-glass border border-border-glass flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-secondary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                      Global Headquarters
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {COMPANY_DETAILS.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form with Suspense (7 cols) */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="p-12 text-center text-xs text-gray-400 animate-pulse">Loading contact form...</div>}>
              <ContactFormInner />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
