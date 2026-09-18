"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, AppointmentInput } from "@/lib/validation";
import { SectionHeader } from "../common/SectionHeader";
import {
  Clock, Video, CheckCircle2, AlertCircle, ChevronRight,
  ChevronLeft, Calendar, User, Building2, Mail, Phone,
  MessageSquare, Loader2, CalendarCheck, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

function getNextNDates(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  let i = 1;
  while (dates.length < n) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // Skip Sundays
      dates.push(d.toISOString().slice(0, 10));
    }
    i++;
  }
  return dates;
}

function formatDate(dateStr: string): { short: string; long: string; day: string } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    short: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    long: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
    day: d.toLocaleDateString("en-IN", { weekday: "short" }),
  };
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m === 0 ? "00" : m} ${period}`;
}

const AVAILABLE_DATES = getNextNDates(14);

interface ConfirmationData {
  id: string;
  callScopeLabel: string;
  duration: number;
  date: string;
  time: string;
  timezone: string;
  meetingUrl: string | null;
}

export const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(AVAILABLE_DATES[0] || "");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { timezone: "Asia/Kolkata", callScope: "DISCOVERY" },
  });

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/appointments?date=${date}`);
      const data = await res.json();
      if (data.slots) setAllSlots(data.slots);
      if (data.occupied) setOccupiedSlots(data.occupied);
    } catch {
      setAllSlots(["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"]);
      setOccupiedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setSelectedTime("");
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const onSubmit = async (data: AppointmentInput) => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          callScope: "DISCOVERY",
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.code === "SLOT_TAKEN") {
          await fetchSlots(selectedDate);
          setSelectedTime("");
          setStep(1);
          throw new Error(json.error || "This 30-minute time slot is already taken. Please select another slot.");
        }
        throw new Error(json.error || "Failed to confirm booking. Please try again.");
      }

      setConfirmation(json.appointment);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="relative py-32 px-6 md:px-12 bg-[#05060A]/95 border-t border-border-glass">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Direct Access"
          title="Reserve a 30-Min Strategy Session with our"
          highlightedTitle="Lead Architects"
          description="Direct 30-minute technical consultation with our engineering partners to evaluate your product vision, architecture, and timeline."
        />

        <div className="mt-12 rounded-3xl p-6 sm:p-10 md:p-12 bg-surface-glass border border-border-glass backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent-secondary/15 rounded-full blur-[120px] pointer-events-none" />

          {confirmation ? (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                <CalendarCheck size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                30-Minute Consultation Reserved
              </h3>
              <p className="text-sm text-text-muted max-w-md font-light">
                Your 30-minute strategy call is confirmed. Booking Reference: <strong className="text-cyan-400 font-mono">{confirmation.id.slice(-8).toUpperCase()}</strong>.
              </p>

              <div className="mt-4 p-5 rounded-2xl bg-white/[0.04] border border-border-glass text-xs text-text-muted flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Calendar size={15} className="text-cyan-400" />
                  <span>{formatDate(confirmation.date).long}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={15} className="text-cyan-400" />
                  <span>{formatTime(confirmation.time)} ({confirmation.timezone}) · 30 min</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Video size={15} className="text-cyan-400" />
                  <span>{confirmation.meetingUrl ? "Google Meet Link Active" : "Google Meet / Zoom"}</span>
                </div>
              </div>

              <button
                onClick={() => { setConfirmation(null); setStep(1); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-surface-glass border border-border-glass text-xs font-semibold text-text-muted hover:text-white transition-colors"
              >
                Book Another 30-Min Call
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Session Overview Banner */}
              <div className="p-4 rounded-2xl bg-[#090D1C] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">30-Min Strategy Consultation</div>
                    <div className="text-[11px] text-gray-400">Technical feasibility, architectural scoping & baseline roadmap</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck size={13} />
                  <span>1-on-1 with Founding Partner</span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-3">
                {[1, 2].map((s) => (
                  <React.Fragment key={s}>
                    <button
                      type="button"
                      onClick={() => s < step && setStep(s)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                        s < step ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer" :
                        s === step ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40" :
                        "bg-white/5 text-gray-500 border border-white/10"
                      )}
                    >
                      {s < step ? <CheckCircle2 size={13} /> : <span className="font-mono">{s}</span>}
                      <span>{s === 1 ? "1. Pick Date & Time" : "2. Your Details"}</span>
                    </button>
                    {s < 2 && <div className={cn("h-px w-8 transition-colors", s < step ? "bg-emerald-500/50" : "bg-white/10")} />}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP 1: Pick Date & 30-Min Time Slot */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Dates */}
                  <div>
                    <span className="text-xs font-semibold text-text-subtle uppercase tracking-wider block mb-3">
                      Select Working Day (Next 14 Days)
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {AVAILABLE_DATES.slice(0, 7).map((d) => {
                        const fmt = formatDate(d);
                        return (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setSelectedDate(d)}
                            className={cn(
                              "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                              selectedDate === d
                                ? "bg-cyan-500/20 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,229,199,0.3)]"
                                : "bg-surface-glass border-border-glass hover:border-white/20 text-text-muted hover:text-white"
                            )}
                          >
                            <span className="text-[10px] uppercase font-semibold">{fmt.day}</span>
                            <span className="text-base font-extrabold">{fmt.short.split(" ")[0]}</span>
                            <span className="text-[9px] uppercase opacity-70">{fmt.short.split(" ")[1]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 30-Min Slots */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-text-subtle uppercase tracking-wider">
                        Available 30-Minute Windows (IST)
                      </span>
                      {loadingSlots && <Loader2 size={14} className="text-cyan-400 animate-spin" />}
                    </div>
                    {loadingSlots ? (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 animate-pulse">
                        {Array(6).fill(null).map((_, i) => (
                          <div key={i} className="h-10 rounded-lg bg-white/5" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {allSlots.map((slot) => {
                          const isOccupied = occupiedSlots.includes(slot);
                          return (
                            <button
                              type="button"
                              key={slot}
                              disabled={isOccupied}
                              onClick={() => !isOccupied && setSelectedTime(slot)}
                              className={cn(
                                "py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all",
                                isOccupied
                                  ? "bg-white/[0.02] border-white/5 text-gray-600 line-through cursor-not-allowed"
                                  : selectedTime === slot
                                    ? "bg-cyan-400 text-black border-cyan-400 font-extrabold shadow-[0_0_15px_rgba(0,229,199,0.4)]"
                                    : "bg-surface-glass border-border-glass text-text-muted hover:text-white hover:border-white/20 cursor-pointer"
                              )}
                            >
                              {formatTime(slot)}
                              {isOccupied && <div className="text-[8px] text-gray-600">Taken</div>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:scale-[1.02] transition-transform flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      <span>Continue to Details</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Customer Information */}
              {step === 2 && (
                <div>
                  {/* Summary bar */}
                  <div className="mb-6 p-4 rounded-2xl bg-[#090D1C] border border-cyan-500/20 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <Clock size={14} />
                      <span>30-Min Strategy Call</span>
                    </div>
                    <div className="text-gray-500">·</div>
                    <div className="text-gray-300">{formatDate(selectedDate).long}</div>
                    <div className="text-gray-500">·</div>
                    <div className="font-mono text-white font-bold">{formatTime(selectedTime)} IST</div>
                  </div>

                  {submitError && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register("callScope")} value="DISCOVERY" />
                    <input type="hidden" {...register("appointmentDate")} value={selectedDate} />
                    <input type="hidden" {...register("appointmentTime")} value={selectedTime} />
                    <input type="hidden" {...register("timezone")} value="Asia/Kolkata" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5 flex items-center gap-1.5">
                          <User size={12} />Full Name *
                        </label>
                        <input
                          type="text"
                          {...register("name")}
                          placeholder="Alex Morgan"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                            errors.name ? "border-red-500" : "border-border-glass focus:border-cyan-400"
                          )}
                        />
                        {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5 flex items-center gap-1.5">
                          <Building2 size={12} />Company / Business *
                        </label>
                        <input
                          type="text"
                          {...register("companyName")}
                          placeholder="Acme Systems / Freelance"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                            errors.companyName ? "border-red-500" : "border-border-glass focus:border-cyan-400"
                          )}
                        />
                        {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5 flex items-center gap-1.5">
                          <Mail size={12} />Work Email *
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="alex@company.com"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                            errors.email ? "border-red-500" : "border-border-glass focus:border-cyan-400"
                          )}
                        />
                        {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5 flex items-center gap-1.5">
                          <Phone size={12} />Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          {...register("phone")}
                          placeholder="+91 93427 44740"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors",
                            errors.phone ? "border-red-500" : "border-border-glass focus:border-cyan-400"
                          )}
                        />
                        {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block mb-1.5 flex items-center gap-1.5">
                        <MessageSquare size={12} />Project Description (Optional)
                      </label>
                      <textarea
                        {...register("projectDescription")}
                        rows={3}
                        placeholder="Briefly describe what you want to build or discuss in this 30-min call..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-glass border border-border-glass focus:border-cyan-400 text-white text-xs placeholder:text-text-subtle focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.4)] hover:shadow-[0_0_35px_rgba(0,229,199,0.7)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <><Loader2 size={14} className="animate-spin" /><span>Confirming...</span></>
                        ) : (
                          <><CalendarCheck size={14} /><span>Confirm 30-Min Reservation →</span></>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
