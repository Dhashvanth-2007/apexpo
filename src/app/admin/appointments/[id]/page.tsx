"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User, Building2, Mail, Phone, Video, AlertCircle, CheckCircle2, XCircle, Clock, ExternalLink, Save, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentDetail {
  id: string; clientId: string; leadId: string | null;
  callScope: string; duration: number; appointmentDate: string; appointmentTime: string;
  timezone: string; status: string; meetingUrl: string | null;
  projectDescription: string | null; notes: string | null; createdAt: string;
  clientName: string; clientEmail: string; clientCompany: string; clientPhone: string;
}
interface LeadRow { id: string; status: string; service: string; createdAt: string; }

const SCOPE_LABELS: Record<string, string> = {
  DISCOVERY: "Discovery & Feasibility Brief",
  ARCHITECTURE: "Full Architecture Deep Dive",
  GROWTH_AUDIT: "Conversion & Growth Teardown",
};
const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  NO_SHOW: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  RESCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};
const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  MEETING_SCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WON: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  LOST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m === 0 ? "00" : m} ${period}`;
}

export default function AppointmentDetailPage() {
  const { id } = useParams() as { id: string };
  const [appt, setAppt] = useState<AppointmentDetail | null>(null);
  const [lead, setLead] = useState<LeadRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Reschedule panel state
  const [showReschedule, setShowReschedule] = useState(false);
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [reschedError, setReschedError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/appointments/" + id)
      .then((r) => r.ok ? r.json() : Promise.reject("Not found"))
      .then((d) => {
        setAppt(d.appointment);
        setLead(d.lead || null);
        setNotes(d.appointment.notes || "");
        setMeetingUrl(d.appointment.meetingUrl || "");
        setReschedDate(d.appointment.appointmentDate);
        setReschedTime(d.appointment.appointmentTime);
      })
      .catch(() => setError("Failed to load appointment."))
      .finally(() => setLoading(false));
  }, [id]);

  const patch = async (updates: Record<string, unknown>) => {
    if (!appt) return;
    setSaving(true);
    setSaveMsg("");
    setReschedError(null);
    try {
      const res = await fetch("/api/admin/appointments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update appointment");
      setAppt(data.appointment);
      setSaveMsg("Saved successfully.");
      setShowReschedule(false);
      setTimeout(() => setSaveMsg(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setSaveMsg(msg);
      if (updates.appointmentDate) setReschedError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedDate || !reschedTime) return;
    patch({ appointmentDate: reschedDate, appointmentTime: reschedTime, status: "RESCHEDULED" });
  };

  if (loading) return <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />;
  if (error || !appt) return (
    <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-xs text-red-400">{error || "Appointment not found"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/appointments" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-white">{SCOPE_LABELS[appt.callScope] || appt.callScope}</h2>
          <p className="text-xs text-gray-400">{appt.appointmentDate} · {formatTime(appt.appointmentTime)} IST · {appt.duration}m</p>
        </div>
        <span className={cn("ml-2 px-3 py-1.5 rounded-full text-xs font-bold border", STATUS_COLORS[appt.status] || "bg-white/10 text-white border-white/20")}>
          {appt.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Client Info */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client</h3>
              <Link href={"/admin/clients/" + appt.clientId} className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1">
                View Profile <ExternalLink size={9} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: User, label: "Name", value: appt.clientName },
                { icon: Building2, label: "Company", value: appt.clientCompany },
                { icon: Mail, label: "Email", value: appt.clientEmail },
                { icon: Phone, label: "Phone", value: appt.clientPhone },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <row.icon size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">{row.label}</div>
                    <div className="text-xs text-white font-semibold">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead info */}
          {lead && (
            <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Associated Lead</h3>
                <Link href={"/admin/leads/" + lead.id} className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1">
                  View <ExternalLink size={10} />
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold border", LEAD_STATUS_COLORS[lead.status] || "bg-white/10 text-white border-white/20")}>
                    {lead.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Service</span>
                  <span className="text-white font-semibold truncate max-w-[160px]">{lead.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Source</span>
                  <span className="text-cyan-300 font-mono text-[10px]">BOOK_A_CALL</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Appointment details */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              {[
                { icon: Calendar, label: "Date", value: appt.appointmentDate },
                { icon: Clock, label: "Time", value: `${formatTime(appt.appointmentTime)} (${appt.timezone})` },
                { icon: Clock, label: "Duration", value: appt.duration + " minutes" },
                { icon: Calendar, label: "Call Scope", value: SCOPE_LABELS[appt.callScope] || appt.callScope },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <row.icon size={13} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">{row.label}</div>
                    <div className="text-white font-semibold">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meeting URL */}
            <div className="pt-4 border-t border-[#1B2234]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Video size={11} />Meeting URL
              </label>
              <div className="flex gap-2">
                <input
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-[#1B2234] focus:border-cyan-500/50 text-white text-xs placeholder:text-gray-600 focus:outline-none"
                />
                <button
                  onClick={() => patch({ meetingUrl })}
                  disabled={saving}
                  className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Save size={12} /><span>Save</span>
                </button>
              </div>
              {appt.meetingUrl && (
                <a href={appt.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-2">
                  Open meeting link <ExternalLink size={9} />
                </a>
              )}
            </div>

            {/* Project description */}
            {appt.projectDescription && (
              <div className="pt-4 border-t border-[#1B2234] mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Context</p>
                <p className="text-xs text-gray-300 leading-relaxed">{appt.projectDescription}</p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Internal Admin Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add private admin notes about this consultation..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#1B2234] focus:border-cyan-500/50 text-white text-xs placeholder:text-gray-600 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-emerald-400">{saveMsg}</span>
              <button
                onClick={() => patch({ notes })}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save size={12} /><span>{saving ? "Saving..." : "Save Notes"}</span>
              </button>
            </div>
          </div>

          {/* Actions & Reschedule */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Actions</h3>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => patch({ status: "CONFIRMED" })}
                disabled={saving || appt.status === "CONFIRMED"}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/30 disabled:opacity-40"
              >
                <CheckCircle2 size={13} />Confirm
              </button>
              <button
                onClick={() => setShowReschedule(!showReschedule)}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30"
              >
                <RefreshCw size={13} />Reschedule
              </button>
              <button
                onClick={() => patch({ status: "COMPLETED" })}
                disabled={saving || appt.status === "COMPLETED"}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30 disabled:opacity-40"
              >
                <CheckCircle2 size={13} />Mark Completed
              </button>
              <button
                onClick={() => patch({ status: "NO_SHOW" })}
                disabled={saving || appt.status === "NO_SHOW"}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/30 disabled:opacity-40"
              >
                <XCircle size={13} />Mark No Show
              </button>
              <button
                onClick={() => patch({ status: "CANCELLED" })}
                disabled={saving || appt.status === "CANCELLED"}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/30 disabled:opacity-40"
              >
                <XCircle size={13} />Cancel
              </button>
            </div>

            {/* Inline Reschedule Form */}
            {showReschedule && (
              <form onSubmit={handleReschedule} className="p-4 rounded-xl bg-white/[0.03] border border-purple-500/30 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Reschedule to New Date & Time</span>
                  <button type="button" onClick={() => setShowReschedule(false)} className="text-gray-500 hover:text-white text-xs">✕</button>
                </div>
                {reschedError && (
                  <p className="text-[11px] text-red-400">{reschedError}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">New Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={reschedDate}
                      onChange={(e) => setReschedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-[#1B2234] text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">New Time (HH:MM)</label>
                    <input
                      type="time"
                      value={reschedTime}
                      onChange={(e) => setReschedTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-[#1B2234] text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving || !reschedDate || !reschedTime}
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? "Rescheduling..." : "Save Rescheduled Time"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
