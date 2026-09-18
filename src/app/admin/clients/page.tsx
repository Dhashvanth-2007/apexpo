"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, ArrowUpRight, AlertCircle, Search, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientRow {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
  appointmentCount: number;
  latestAppointment: string | null;
  leadStatus: string | null;
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  MEETING_SCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WON: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  LOST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.ok ? r.json() : Promise.reject("Failed to load"))
      .then((d) => { setClients(d.clients || []); })
      .catch(() => setError("Failed to load clients."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Clients</h2>
          <p className="text-xs text-gray-400">All clients who have booked a strategy call.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-[#1B2234] text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 w-52"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 rounded-2xl bg-white/[0.02] border border-[#1B2234] text-center">
          <UserCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-sm font-bold text-white mb-1">{search ? "No clients match your search" : "No clients yet."}</p>
          <p className="text-xs text-gray-500">{search ? "Try a different search term." : "Clients appear automatically when someone books a strategy call."}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-5">Company</th>
                  <th className="py-3 px-5">Contact</th>
                  <th className="py-3 px-5">Appointments</th>
                  <th className="py-3 px-5">Lead Status</th>
                  <th className="py-3 px-5">Since</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-bold text-white">{client.name}</td>
                    <td className="py-4 px-5 text-gray-300">{client.companyName}</td>
                    <td className="py-4 px-5">
                      <div className="text-gray-300">{client.email}</div>
                      <div className="text-gray-500 font-mono text-[10px]">{client.phone}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-cyan-400" />
                        <span className="font-mono text-white">{client.appointmentCount}</span>
                      </div>
                      {client.latestAppointment && (
                        <div className="text-[10px] text-gray-500 mt-0.5">Last: {client.latestAppointment}</div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {client.leadStatus ? (
                        <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold border", LEAD_STATUS_COLORS[client.leadStatus] || "bg-white/10 text-white border-white/20")}>
                          {client.leadStatus.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-gray-500 font-mono text-[10px]">
                      {new Date(client.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={"/admin/clients/" + client.id}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        View <ArrowUpRight size={11} />
                      </Link>
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
