"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, MessageSquare, Building2, User, Calendar, 
  Clock, CheckCircle2, Send, Trash2, AlertCircle, Shield, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadDetail {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  notes?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  details?: string | null;
  userName?: string | null;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "MEETING_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/leads/${leadId}`).then((r) => r.json()),
      fetch("/api/admin/team").then((r) => r.json()),
    ])
      .then(([leadRes, teamRes]) => {
        if (leadRes.success) {
          setLead(leadRes.lead);
          setActivities(leadRes.activities || []);
        }
        if (teamRes.success) {
          setTeam(teamRes.team || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [leadId]);

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setActivities(data.activities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAssignee = async (assignedToId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: assignedToId || null }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setActivities(data.activities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newNote }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setActivities(data.activities);
        setNewNote("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/leads");
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete lead");
      }
    } catch {
      alert("Error deleting lead");
    }
  };

  if (loading && !lead) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-12 text-center text-gray-400">
        <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
        <h3 className="text-base font-bold text-white mb-2">Lead Record Not Found</h3>
        <Link href="/admin/leads" className="text-xs text-cyan-400 hover:underline">
          Return to Leads Directory
        </Link>
      </div>
    );
  }

  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for reaching out to APEXPO regarding your ${lead.service} project.`)}`;

  return (
    <div className="space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{lead.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                {lead.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">{lead.businessName} • Received {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>

        {/* Direct Action Contact Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <Phone size={13} />
            <span>Call</span>
          </a>
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`APEXPO — ${lead.service} Project Brief`)}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <Mail size={13} />
            <span>Email</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
          >
            <MessageSquare size={13} />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => setDeleteModal(true)}
            className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-[#1B2234] transition-colors"
            title="Delete Record"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Pipeline Status Advance Bar */}
      <div className="p-4 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Stage Progression</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STATUS_OPTIONS.map((st) => {
            const isActive = lead.status === st;
            return (
              <button
                key={st}
                onClick={() => updateStatus(st)}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-bold tracking-wide transition-all border text-center truncate",
                  isActive
                    ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,229,199,0.3)]"
                    : "bg-white/[0.02] border-[#1B2234] text-gray-400 hover:text-white hover:border-gray-600"
                )}
              >
                {st.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client & Project Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Business Info */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Full Name</span>
                <span className="font-bold text-white text-sm">{lead.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Business Name</span>
                <span className="font-bold text-white text-sm">{lead.businessName}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Work Email</span>
                <a href={`mailto:${lead.email}`} className="text-cyan-400 hover:underline">{lead.email}</a>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Phone / WhatsApp</span>
                <span className="font-mono text-gray-200">{lead.phone}</span>
              </div>
            </div>
          </div>

          {/* Project Goals & Requirements */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3">
              Project Specification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <span className="text-gray-500 block mb-1">Requested Capability</span>
                <span className="font-bold text-cyan-300">{lead.service}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Estimated Budget</span>
                <span className="font-mono text-emerald-400 font-bold">{lead.budget}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 text-xs block mb-2">Project Brief & Message</span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-[#1B2234] text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-light">
                {lead.message}
              </div>
            </div>
          </div>

          {/* Internal Notes Editor */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3">
              Internal Partner Notes (Private)
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Log internal details, budget feedback, call outcomes, or client preferences..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-[#1B2234] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={12} />
                  <span>{savingNote ? "Saving..." : "Save Note"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Assignment & Activity History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Team Assignment Panel */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Team Member Assignment</h3>
            <select
              value={lead.assignedToId || ""}
              onChange={(e) => updateAssignee(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0F1322] border border-[#1B2234] text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="">Unassigned</option>
              {team.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
            {lead.assignedToName && (
              <p className="text-[11px] text-gray-400">Currently assigned to <span className="text-cyan-300 font-bold">{lead.assignedToName}</span></p>
            )}
          </div>

          {/* Activity Timeline Audit */}
          <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3">
              Activity History & Audit
            </h3>
            {activities.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">No activity recorded yet.</div>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="relative pl-6 border-l border-cyan-500/30 space-y-1">
                    <span className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-cyan-400" />
                    <div className="text-xs font-bold text-white">{act.action.replace("_", " ")}</div>
                    {act.details && <div className="text-[11px] text-gray-300">{act.details}</div>}
                    <div className="text-[10px] font-mono text-gray-500">
                      by {act.userName || "Admin"} • {new Date(act.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-red-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={24} />
              <h3 className="text-base font-bold text-white">Permanently Delete Lead?</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              This will remove all details, customer inquiries, and activity audit trails for {lead.name}. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
