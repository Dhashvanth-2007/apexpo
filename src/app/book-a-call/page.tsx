"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, AppointmentInput } from "@/lib/validation";
import { SectionHeader } from "@/components/common/SectionHeader";
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
    if (d.getDay() !== 0) {
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
  appointmentId: string;
  callScopeLabel: string;
  duration: number;
  date: string;
  time: string;
  timezone: string;
  meetingUrl: string | null;
}

export default function BookACallPage() {
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
          throw new Error(json.error || "This 30-minute time slot is already taken. Please select another time.");
        }
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setConfirmation(json.appointment);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmed screen
  if (confirmation) {
    return (
      <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <CalendarCheck size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">30-Min Session Confirmed</h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Your 30-minute strategy call with our lead architects has been confirmed.
          </p>

          <div className="p-8 rounded-3xl bg-[#090D1C] border border-[#1B2234] text-left space-y-4 mb-8">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 size={14} />
              <span>Booking Reference: <span className="font-mono text-white">{(confirmation.appointmentId || "").slice(-8).toUpperCase()}</span></span>
            </div>
            {[
              { label: "Session Type", value: "30-Min Strategy Consultation" },
              { label: "Duration", value: "30 minutes" },
              { label: "Date", value: formatDate(confirmation.date).long },
              { label: "Time", value: `${formatTime(confirmation.time)} IST` },
              { label: "Timezone", value: confirmation.timezone },
              { label: "Meeting Link", value: confirmation.meetingUrl || "Google Meet link dispatched prior to session" },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 py-2 border-b border-[#1B2234] last:border-0">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">{row.label}</span>
                <span className="text-xs text-white font-semibold text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setConfirmation(null); setStep(1); setSelectedTime(""); }}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Book Another Session
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Direct Partner Consultation"
          title="Reserve a 30-min strategy session with"
          highlightedTitle="an engineering partner"
          description="Direct 30-minute discovery call with founding architects. Pick your date, select an open 30-min slot, and submit your details."
        />

        {/* Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-[#090D1C] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
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
            <span>Dedicated 30-Min Window</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mt-8 mb-8">
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
                <span>{s === 1 ? "1. Pick Date & 30-Min Slot" : "2. Your Details"}</span>
              </button>
              {s < 2 && <div className={cn("h-px w-8 transition-colors", s < step ? "bg-emerald-500/50" : "bg-white/10")} />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Date (Next 14 Working Days)</p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {AVAILABLE_DATES.map((date) => {
                  const formatted = formatDate(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer",
                        selectedDate === date
                          ? "border-cyan-400 bg-cyan-400/15 text-white"
                          : "border-[#1B2234] bg-white/[0.02] text-gray-400 hover:border-gray-600 hover:text-white"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase">{formatted.day}</span>
                      <span className="text-sm font-black font-mono">{formatted.short.split(" ")[0]}</span>
                      <span className="text-[10px] text-gray-500">{formatted.short.split(" ")[1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available 30-Minute Slots (IST)</p>
                {loadingSlots && <Loader2 size={14} className="text-cyan-400 animate-spin" />}
              </div>
              {loadingSlots ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 animate-pulse">
                  {Array(8).fill(null).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {allSlots.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => !isOccupied && setSelectedTime(slot)}
                        className={cn(
                          "py-2.5 px-2 rounded-xl border text-xs font-mono font-semibold transition-all text-center",
                          isOccupied
                            ? "border-white/5 bg-white/[0.02] text-gray-600 cursor-not-allowed line-through"
                            : selectedTime === slot
                              ? "border-cyan-400 bg-cyan-400/15 text-white shadow-[0_0_12px_rgba(0,229,199,0.2)]"
                              : "border-[#1B2234] bg-white/[0.02] text-gray-300 hover:border-gray-600 hover:text-white cursor-pointer"
                        )}
                      >
                        {formatTime(slot)}
                        {isOccupied && <div className="text-[9px] text-gray-600 mt-0.5">Taken</div>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.4)] hover:shadow-[0_0_35px_rgba(0,229,199,0.7)] transition-all flex items-center gap-2 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
              >
                <span>Continue to Details</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Details & Confirm */}
        {step === 2 && (
          <div>
            <div className="mb-6 p-4 rounded-2xl bg-[#090D1C] border border-cyan-500/20 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-cyan-400">
                <Clock size={13} />
                <span className="font-semibold">30-Min Strategy Consultation</span>
              </div>
              <div className="text-gray-400">·</div>
              <div className="text-gray-300">{formatDate(selectedDate).long}</div>
              <div className="text-gray-400">·</div>
              <div className="font-mono text-white font-bold">{formatTime(selectedTime)} IST</div>
            </div>

            {submitError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
                <AlertCircle size={15} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input type="hidden" {...register("callScope")} value="DISCOVERY" />
              <input type="hidden" {...register("appointmentDate")} value={selectedDate} />
              <input type="hidden" {...register("appointmentTime")} value={selectedTime} />
              <input type="hidden" {...register("timezone")} value="Asia/Kolkata" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                    <User size={12} />Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Alex Morgan"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors",
                      errors.name ? "border-red-500" : "border-[#1B2234] focus:border-cyan-400"
                    )}
                  />
                  {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                    <Building2 size={12} />Business / Company *
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="Acme Systems / Freelance"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors",
                      errors.companyName ? "border-red-500" : "border-[#1B2234] focus:border-cyan-400"
                    )}
                  />
                  {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                    <Mail size={12} />Work Email *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="alex@company.com"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors",
                      errors.email ? "border-red-500" : "border-[#1B2234] focus:border-cyan-400"
                    )}
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                    <Phone size={12} />Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="+91 93427 44740"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-surface-glass border text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors",
                      errors.phone ? "border-red-500" : "border-[#1B2234] focus:border-cyan-400"
                    )}
                  />
                  {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} />Project Description (Optional)
                </label>
                <textarea
                  {...register("projectDescription")}
                  rows={3}
                  placeholder="Briefly describe what you'd like to discuss in this 30-min session..."
                  className="w-full px-4 py-3 rounded-xl bg-surface-glass border border-[#1B2234] focus:border-cyan-400 text-white text-xs placeholder:text-gray-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
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
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.4)] hover:shadow-[0_0_35px_rgba(0,229,199,0.7)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
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
    </main>
  );
}
