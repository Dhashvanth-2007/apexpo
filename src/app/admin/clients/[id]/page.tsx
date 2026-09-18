"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User, Building2, Mail, Phone, AlertCircle, ExternalLink, FolderGit2, Save, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientDetail {
  id: string; name: string; companyName: string; email: string; phone: string; notes?: string | null; createdAt: string;
}
interface AppointmentRow {
  id: string; callScope: string; duration: number; appointmentDate: string; appointmentTime: string;
  timezone: string; status: string; meetingUrl: string | null;
}
interface LeadRow {
  id: string; status: string; service: string; createdAt: string;
}

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
  MEETING_SCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  NEW: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WON: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  LOST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function ClientDetailPage() {
  const { id } = useParams() as { id: string };
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [lead, setLead] = useState<LeadRow | null>(null);
  const [clientNotes, setClientNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesMsg, setNotesMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/clients/" + id)
      .then((r) => r.ok ? r.json() : Promise.reject("Not found"))
      .then((d) => {
        setClient(d.client);
        setAppointments(d.appointments || []);
        setLead(d.lead || null);
        setClientNotes(d.client.notes || "");
      })
      .catch(() => setError("Failed to load client."))
      .finally(() => setLoading(false));
  }, [id]);

  const saveNotes = async () => {
    setSavingNotes(true);
    setNotesMsg("");
    try {
      const res = await fetch("/api/admin/clients/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: clientNotes }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setNotesMsg("Notes saved.");
      setTimeout(() => setNotesMsg(""), 3000);
    } catch {
      setNotesMsg("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />;
  if (error || !client) return (
    <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-xs text-red-400">{error || "Client not found"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/clients" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-white">{client.name}</h2>
          <p className="text-xs text-gray-400">{client.companyName} · Client since {new Date(client.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Customer Info */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Information</h3>
            <div className="space-y-3">
              {[
                { icon: User, label: "Name", value: client.name },
                { icon: Building2, label: "Company", value: client.companyName },
                { icon: Mail, label: "Email", value: client.email },
                { icon: Phone, label: "Phone", value: client.phone },
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-gray-300 font-mono text-[10px]">{new Date(lead.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderGit2 size={13} className="text-cyan-400" />
              <span>Associated Projects</span>
            </h3>
            <p className="text-xs text-gray-500">No active production projects assigned yet. Convert this client from an inquiry to start a sprint.</p>
          </div>
        </div>

        {/* Right Column — Appointments & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
            <div className="p-5 border-b border-[#1B2234]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Appointments ({appointments.length})</h3>
            </div>
            {appointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">No appointments found for this client.</div>
            ) : (
              <div className="divide-y divide-[#1B2234]">
                {appointments.map((a) => (
                  <div key={a.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Calendar size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">{SCOPE_LABELS[a.callScope] || a.callScope}</div>
                        <div className="text-[11px] text-gray-400">{a.appointmentDate} · {a.appointmentTime} ({a.timezone}) · {a.duration}min</div>
                        {a.meetingUrl && (
                          <a href={a.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-1">
                            Join Meeting <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold border", STATUS_COLORS[a.status] || "bg-white/10 text-white border-white/20")}>
                        {a.status}
                      </span>
                      <Link href={"/admin/appointments/" + a.id} className="text-[10px] text-cyan-400 hover:underline">
                        Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare size={13} className="text-cyan-400" />
              <span>Internal Admin Notes</span>
            </h3>
            <textarea
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              rows={4}
              placeholder="Add private internal notes about this client relationship, budget expectations, or follow-ups..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#1B2234] focus:border-cyan-500/50 text-white text-xs placeholder:text-gray-600 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-emerald-400">{notesMsg}</span>
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save size={12} /><span>{savingNotes ? "Saving..." : "Save Client Notes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
