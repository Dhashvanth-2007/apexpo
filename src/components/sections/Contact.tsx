"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Clock } from "lucide-react";
import { COMPANY_DETAILS, SERVICES, BUDGET_TIERS } from "@/lib/constants";
import { SectionHeader } from "../common/SectionHeader";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  serviceInterest: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select an approximate budget"),
  message: z.string().min(10, "Please provide brief project details (min 10 characters)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CAPABILITY_OPTIONS = [
  "Business & Corporate Website",
  "E-Commerce & Online Store",
  "Mobile App Development",
  "UI/UX Design & Prototype",
  "Event & Conference Website",
  "Personal Portfolio & Branding",
  "Custom Web Application / Dashboard",
  "Website Redesign & Speed Optimization",
  "Monthly Maintenance & Tech Support",
];

const BUDGET_OPTIONS = BUDGET_TIERS;

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          businessName: "Direct Website Inquiry",
          email: data.email,
          phone: data.phone,
          service: data.serviceInterest,
          budget: data.budget,
          message: data.message,
          honeypot: "",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to transmit your inquiry. Please try again.");
      }

      setSubmitted(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappMessage)}`;

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 bg-[#05060A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Initiate Contact"
          title="Let's engineer something"
          highlightedTitle="extraordinary together"
          description="Have an ambitious digital project or redesign? Reach out below and our engineering directors will respond within 2 business hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          {/* Contact Details & SLA Guarantee (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="rounded-2xl p-6 sm:p-8 bg-surface-glass border border-border-glass backdrop-blur-xl">
                <div className="flex items-center gap-2.5 text-accent-secondary mb-4">
                  <Clock size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    SLA Response Guarantee
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Direct Partner Access
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-light">
                  You will never be routed through junior account reps. Every inquiry is reviewed directly by our founding engineers and creative leads.
                </p>
              </div>

              {/* Direct channels */}
              {/* Direct channels */}
              <div className="space-y-4">
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-glass border border-border-glass hover:border-accent-secondary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center text-accent-secondary group-hover:scale-110 transition-transform shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-text-subtle tracking-wider block">
                      Email Inquiries
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-accent-secondary transition-colors truncate block">
                      {COMPANY_DETAILS.email}
                    </span>
                  </div>
                </a>

                {/* Primary Phone */}
                <a
                  href="tel:+919342744740"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-glass border border-border-glass hover:border-accent-primary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-subtle tracking-wider block">
                      Direct Telephone (Line 1)
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-accent-primary transition-colors">
                      +91 93427 44740
                    </span>
                  </div>
                </a>

                {/* Secondary Phone */}
                <a
                  href="tel:+918903732621"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-glass border border-border-glass hover:border-accent-primary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-subtle tracking-wider block">
                      Direct Telephone (Line 2)
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-accent-primary transition-colors">
                      +91 89037 32621
                    </span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-glass border border-border-glass hover:border-[#25D366]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-subtle tracking-wider block">
                      WhatsApp Live Chat
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-[#25D366] transition-colors">
                      Chat on WhatsApp (+91 93427 44740)
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border-glass flex items-center gap-3 text-xs text-text-muted">
              <MapPin size={16} className="text-accent-secondary shrink-0" />
              <span>{COMPANY_DETAILS.address}</span>
            </div>
          </div>

          {/* Validated Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-8 sm:p-12 bg-surface-glass border border-border-glass backdrop-blur-2xl shadow-2xl relative">
              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-secondary/20 border border-accent-secondary flex items-center justify-center text-accent-secondary shadow-[0_0_25px_rgba(0,229,199,0.5)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Transmission Received
                  </h3>
                  <p className="text-sm text-text-muted max-w-md font-light">
                    Thank you. An engineering partner has been assigned to your brief and will contact you within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-surface-glass border border-border-glass text-xs font-semibold text-text-muted hover:text-white transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                      <span>{submitError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                        Your Name *
                      </label>
                      <input
                        {...register("fullName")}
                        placeholder="Alex Mercer"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                          errors.fullName
                            ? "border-red-500"
                            : "border-border-glass focus:border-accent-secondary"
                        )}
                      />
                      {errors.fullName && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                        Work Email *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="alex@company.com"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                          errors.email
                            ? "border-red-500"
                            : "border-border-glass focus:border-accent-secondary"
                        )}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        {...register("phone")}
                        placeholder="+1 (555) 000-0000"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                          errors.phone
                            ? "border-red-500"
                            : "border-border-glass focus:border-accent-secondary"
                        )}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Service Interest */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                        What Do You Want to Build? *
                      </label>
                      <select
                        {...register("serviceInterest")}
                        defaultValue=""
                        className={cn(
                          "w-full px-4 py-3 rounded-xl bg-[#090C16] border text-white text-xs focus:outline-none transition-colors",
                          errors.serviceInterest
                            ? "border-red-500"
                            : "border-border-glass focus:border-accent-secondary"
                        )}
                      >
                        <option value="" disabled>Select What You Need</option>
                        {CAPABILITY_OPTIONS.map((cap) => (
                          <option key={cap} value={cap}>
                            {cap}
                          </option>
                        ))}
                      </select>
                      {errors.serviceInterest && (
                        <p className="text-[10px] text-red-400 mt-1">{errors.serviceInterest.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                      Estimated Project Budget *
                    </label>
                    <select
                      {...register("budget")}
                      defaultValue=""
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-[#090C16] border text-white text-xs focus:outline-none transition-colors",
                        errors.budget
                          ? "border-red-500"
                          : "border-border-glass focus:border-accent-secondary"
                      )}
                    >
                      <option value="" disabled>Select Budget Tier</option>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.budget.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                      Project Goals & Context *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Brief overview of your timeline, targets, and desired deliverables..."
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                        errors.message
                          ? "border-red-500"
                          : "border-border-glass focus:border-accent-secondary"
                      )}
                    />
                    {errors.message && (
                      <p className="text-[10px] text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.4)] hover:shadow-[0_0_35px_rgba(0,229,199,0.7)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? "Transmitting..." : "Transmit Project Brief"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
