"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, UserCheck, Calendar, FileText, CheckCircle2, XCircle, 
  ArrowUpRight, Clock, Filter, AlertCircle, BarChart3, TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  counts: {
    total: number;
    new: number;
    contacted: number;
    meetingScheduled: number;
    proposalSent: number;
    won: number;
    lost: number;
    appointmentsTotal?: number;
    appointmentsUpcoming?: number;
  };
  byService: Record<string, number>;
  byBudget: Record<string, number>;
  byStatus: Record<string, number>;
  timeSeries: { date: string; count: number }[];
  recentLeads: Array<{
    id: string;
    name: string;
    businessName: string;
    service: string;
    budget: string;
    status: string;
    createdAt: string;
  }>;
  recentAppointments?: Array<{
    id: string;
    clientName: string;
    clientEmail: string;
    callScope?: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  MEETING_SCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WON: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  LOST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  CONFIRMED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  RESCHEDULED: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?days=${days}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load statistics");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Failed to Load Dashboard Data</h3>
        <p className="text-xs text-gray-400 mb-4">{error || "Could not retrieve metrics"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const kpis = [
    { label: "Total Leads", value: stats.counts.total, icon: Users, color: "text-white", href: "/admin/leads" },
    { label: "New Leads", value: stats.counts.new, icon: AlertCircle, color: "text-cyan-400", href: "/admin/leads" },
    { label: "Contacted", value: stats.counts.contacted, icon: UserCheck, color: "text-blue-400", href: "/admin/leads" },
    { label: "Booked Calls", value: stats.counts.appointmentsTotal ?? stats.counts.meetingScheduled, icon: Calendar, color: "text-purple-400", href: "/admin/appointments" },
    { label: "Proposals", value: stats.counts.proposalSent, icon: FileText, color: "text-amber-400", href: "/admin/leads" },
    { label: "Won", value: stats.counts.won, icon: CheckCircle2, color: "text-emerald-400", href: "/admin/leads" },
    { label: "Lost", value: stats.counts.lost, icon: XCircle, color: "text-rose-400", href: "/admin/leads" },
  ];

  const maxTimeCount = Math.max(...stats.timeSeries.map((t) => t.count), 1);

  return (
    <div className="space-y-8">
      {/* Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Executive CRM Intelligence</h2>
          <p className="text-xs text-gray-400">Real-time pipeline metrics and client enquiry distribution.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-[#1B2234] self-start sm:self-auto">
          {[
            { label: "7 Days", value: 7 },
            { label: "30 Days", value: 30 },
            { label: "90 Days", value: 90 },
            { label: "1 Year", value: 365 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setDays(item.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                days === item.value
                  ? "bg-cyan-400 text-black font-extrabold shadow-sm"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="p-4 rounded-2xl bg-[#0E121E] border border-[#1B2234] hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">{kpi.label}</span>
              <kpi.icon size={15} className={cn(kpi.color, "transition-transform group-hover:scale-110")} />
            </div>
            <div className={cn("text-2xl sm:text-3xl font-black font-mono tracking-tight", kpi.color)}>
              {kpi.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Leads Over Time */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leads Timeline ({days} Days)</h3>
            </div>
            <span className="text-[11px] font-mono text-gray-400">Total: {stats.timeSeries.reduce((acc, cur) => acc + cur.count, 0)}</span>
          </div>

          {stats.counts.total === 0 ? (
            <div className="py-20 text-center text-xs text-gray-500">
              No lead data available yet for this time window.
            </div>
          ) : (
            <div className="h-56 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 border-b border-[#1B2234]">
              {stats.timeSeries.map((pt) => {
                const heightPercent = Math.max((pt.count / maxTimeCount) * 100, 4);
                return (
                  <div key={pt.date} className="flex-1 flex flex-col items-center group relative">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={cn(
                        "w-full rounded-t-sm transition-all duration-300",
                        pt.count > 0 ? "bg-cyan-400 group-hover:bg-cyan-300 shadow-[0_0_10px_rgba(0,229,199,0.3)]" : "bg-white/[0.04]"
                      )}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 px-2 py-1 rounded bg-[#1B2234] border border-gray-700 text-[10px] font-mono whitespace-nowrap shadow-xl">
                      {pt.date}: {pt.count} lead{pt.count === 1 ? "" : "s"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mt-2 px-1">
            <span>{stats.timeSeries[0]?.date}</span>
            <span>{stats.timeSeries[stats.timeSeries.length - 1]?.date}</span>
          </div>
        </div>

        {/* Chart 2: Leads by Status */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status Funnel</h3>
            </div>

            <div className="space-y-3">
              {[
                { status: "NEW", count: stats.counts.new, color: "bg-cyan-400" },
                { status: "CONTACTED", count: stats.counts.contacted, color: "bg-blue-400" },
                { status: "MEETING_SCHEDULED", count: stats.counts.meetingScheduled, color: "bg-purple-400" },
                { status: "PROPOSAL_SENT", count: stats.counts.proposalSent, color: "bg-amber-400" },
                { status: "WON", count: stats.counts.won, color: "bg-emerald-400" },
                { status: "LOST", count: stats.counts.lost, color: "bg-rose-400" },
              ].map((s) => {
                const percent = stats.counts.total > 0 ? Math.round((s.count / stats.counts.total) * 100) : 0;
                return (
                  <div key={s.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-300">{s.status.replace("_", " ")}</span>
                      <span className="font-mono text-gray-400">{s.count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div style={{ width: `${percent}%` }} className={cn("h-full rounded-full", s.color)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin/leads"
            className="mt-6 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-bold text-center text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Pipeline Kanban</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* Breakdown by Service & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Leads by Requested Capability</h3>
          {Object.keys(stats.byService).length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No service inquiries registered yet.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(stats.byService).map(([svc, count]) => {
                const percent = stats.counts.total > 0 ? Math.round((count / stats.counts.total) * 100) : 0;
                return (
                  <div key={svc} className="p-3 rounded-xl bg-white/[0.02] border border-[#1B2234] flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-300 truncate max-w-[240px] sm:max-w-xs">{svc}</div>
                    <div className="text-xs font-mono font-bold text-cyan-400">{count} ({percent}%)</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Leads by Budget Tier</h3>
          {Object.keys(stats.byBudget).length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No budget selections recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(stats.byBudget).map(([bgt, count]) => {
                const percent = stats.counts.total > 0 ? Math.round((count / stats.counts.total) * 100) : 0;
                return (
                  <div key={bgt} className="p-3 rounded-xl bg-white/[0.02] border border-[#1B2234] flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-300 truncate max-w-[240px] sm:max-w-xs">{bgt}</div>
                    <div className="text-xs font-mono font-bold text-emerald-400">{count} ({percent}%)</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        <div className="p-5 border-b border-[#1B2234] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Project Enquiries</h3>
            <p className="text-[11px] text-gray-400">Incoming prospective client submissions awaiting action.</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Leads ({stats.counts.total})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {stats.recentLeads.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500">
            No lead data available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Business</th>
                  <th className="py-3 px-5">Service</th>
                  <th className="py-3 px-5">Budget</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-bold text-white">{lead.name}</td>
                    <td className="py-4 px-5 text-gray-300">{lead.businessName}</td>
                    <td className="py-4 px-5 text-gray-400 truncate max-w-[180px]">{lead.service}</td>
                    <td className="py-4 px-5 text-gray-300 font-mono text-[11px]">{lead.budget}</td>
                    <td className="py-4 px-5">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border", STATUS_COLOR[lead.status] || "bg-white/10 text-white")}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-500 font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] transition-colors"
                      >
                        View Lead
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booked Appointments & Strategy Calls Table */}
      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        <div className="p-5 border-b border-[#1B2234] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Booked Strategy Calls</h3>
            </div>
            <p className="text-[11px] text-gray-400">Scheduled 30-min discovery sessions booked via public website.</p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Appointments ({stats.counts.appointmentsTotal || 0})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {(!stats.recentAppointments || stats.recentAppointments.length === 0) ? (
          <div className="py-12 text-center text-xs text-gray-500">
            No strategy calls scheduled yet. Public bookings will automatically appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Customer / Contact</th>
                  <th className="py-3 px-5">Scope</th>
                  <th className="py-3 px-5">Session Date</th>
                  <th className="py-3 px-5">Time Slot</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {stats.recentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{appt.clientName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{appt.clientEmail}</div>
                    </td>
                    <td className="py-4 px-5 text-gray-300 font-medium">
                      {appt.callScope || "30-min Discovery Brief"}
                    </td>
                    <td className="py-4 px-5 font-mono text-purple-300 font-semibold">
                      {appt.appointmentDate}
                    </td>
                    <td className="py-4 px-5 font-mono text-cyan-300 font-bold">
                      {appt.appointmentTime} IST
                    </td>
                    <td className="py-4 px-5">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border", STATUS_COLOR[appt.status] || "bg-white/10 text-white")}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/admin/appointments/${appt.id}`}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-[11px] transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
