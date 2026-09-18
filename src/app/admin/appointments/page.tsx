"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CalendarCheck, AlertCircle, ArrowUpRight, CalendarX, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentRow {
  id: string;
  clientName: string; clientEmail: string; clientCompany: string; clientPhone: string;
  callScope: string; duration: number; appointmentDate: string; appointmentTime: string;
  timezone: string; status: string; meetingUrl: string | null; createdAt: string;
}

const SCOPE_LABELS: Record<string, string> = {
  DISCOVERY: "Discovery Brief",
  ARCHITECTURE: "Architecture Deep Dive",
  GROWTH_AUDIT: "Growth Teardown",
};
const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  NO_SHOW: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  RESCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "noshow", label: "No Show" },
];

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m === 0 ? "00" : m} ${period}`;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const load = useCallback((filter: string) => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/appointments?filter=" + filter)
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to load appointments.");
        setAppointments(d.appointments || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load appointments."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(activeFilter); }, [activeFilter, load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the appointment for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete");
      }
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete appointment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Appointments</h2>
          <p className="text-xs text-gray-400">All strategy calls booked through the public booking page.</p>
        </div>
        <button
          onClick={() => load(activeFilter)}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <CalendarCheck size={14} className="text-cyan-400" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-[#1B2234] self-start overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
              activeFilter === f.key ? "bg-cyan-400 text-black font-extrabold shadow-sm" : "text-gray-400 hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-red-400">{error}</p>
          <button
            onClick={() => load(activeFilter)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-24 rounded-2xl bg-white/[0.02] border border-[#1B2234] text-center">
          <CalendarX className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-sm font-bold text-white mb-1">{activeFilter !== "all" ? "No appointments for this filter." : "No appointments yet."}</p>
          <p className="text-xs text-gray-500 mb-4">Appointments appear when customers book via the public booking page.</p>
          <button
            onClick={() => load("all")}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors"
          >
            Show All Appointments
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-5">Session Type</th>
                  <th className="py-3 px-5">Date & Time</th>
                  <th className="py-3 px-5">Duration</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{a.clientName}</div>
                      <div className="text-gray-500 text-[10px]">{a.clientCompany}</div>
                    </td>
                    <td className="py-4 px-5 text-gray-300">{SCOPE_LABELS[a.callScope] || a.callScope}</td>
                    <td className="py-4 px-5">
                      <div className="text-white font-mono">{a.appointmentDate}</div>
                      <div className="text-gray-400 text-[11px]">{formatTime(a.appointmentTime)} IST</div>
                    </td>
                    <td className="py-4 px-5 text-gray-300 font-mono">{a.duration}m</td>
                    <td className="py-4 px-5">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", STATUS_COLORS[a.status] || "bg-white/10 text-white border-white/20")}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={"/admin/appointments/" + a.id}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          Detail <ArrowUpRight size={11} />
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id, a.clientName)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete appointment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
