"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, Search, Filter, ArrowUpDown, Download, Kanban, Table as TableIcon,
  ExternalLink, Mail, Phone, MoreVertical, Trash2, CheckCircle2, ChevronRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadItem {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  status: string;
  assignedToName?: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = ["ALL", "NEW", "CONTACTED", "MEETING_SCHEDULED", "PROPOSAL_SENT", "WON", "LOST"];

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  CONTACTED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  MEETING_SCHEDULED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  PROPOSAL_SENT: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  WON: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  LOST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = () => {
    setLoading(true);
    const query = new URLSearchParams({
      status: selectedStatus,
      search,
      sort,
    });
    fetch(`/api/admin/leads?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.leads || []);
          setCounts(data.counts || {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteModalId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${deleteModalId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteModalId(null);
        fetchLeads();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete lead");
      }
    } catch {
      alert("Error deleting lead");
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Name", "Business", "Email", "Phone", "Service", "Budget", "Status", "AssignedTo", "Created"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.businessName.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      `"${l.service.replace(/"/g, '""')}"`,
      `"${l.budget.replace(/"/g, '""')}"`,
      l.status,
      l.assignedToName || "Unassigned",
      l.createdAt,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `apexpo-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Customer Enquiries & CRM</h2>
          <p className="text-xs text-gray-400">Manage client acquisition, pipeline stages, and project scopes.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="p-1 rounded-xl bg-white/[0.03] border border-[#1B2234] flex items-center">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === "table" ? "bg-cyan-400 text-black font-extrabold" : "text-gray-400 hover:text-white"
              )}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("pipeline")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === "pipeline" ? "bg-cyan-400 text-black font-extrabold" : "text-gray-400 hover:text-white"
              )}
            >
              <Kanban size={14} />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E121E] border border-[#1B2234] flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by customer name, business, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </form>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0F1322] border border-[#1B2234] text-xs text-gray-300 focus:outline-none"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st === "ALL" ? "All Statuses" : st.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="px-3 py-2 rounded-xl bg-[#0F1322] border border-[#1B2234] text-xs text-gray-300 focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading leads directory...</div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center text-xs text-gray-500">
              No project enquiries have been received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Customer & Business</th>
                    <th className="py-3.5 px-5">Contact</th>
                    <th className="py-3.5 px-5">Service Scope</th>
                    <th className="py-3.5 px-5">Budget</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Assigned To</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2234]">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5">
                        <Link href={`/admin/leads/${lead.id}`} className="font-bold text-white hover:text-cyan-400 block truncate max-w-[180px]">
                          {lead.name}
                        </Link>
                        <span className="text-[11px] text-gray-400 block truncate max-w-[180px]">{lead.businessName}</span>
                      </td>

                      <td className="py-4 px-5 text-gray-300">
                        <div className="font-mono text-[11px]">{lead.phone}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[160px]">{lead.email}</div>
                      </td>

                      <td className="py-4 px-5 text-gray-300 truncate max-w-[180px]">
                        {lead.service}
                      </td>

                      <td className="py-4 px-5 font-mono text-[11px] text-gray-300 truncate max-w-[130px]">
                        {lead.budget}
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border focus:outline-none cursor-pointer",
                            STATUS_COLOR[lead.status] || "bg-white/10 text-white"
                          )}
                        >
                          <option value="NEW" className="bg-[#0F1322] text-white">NEW</option>
                          <option value="CONTACTED" className="bg-[#0F1322] text-white">CONTACTED</option>
                          <option value="MEETING_SCHEDULED" className="bg-[#0F1322] text-white">MEETING SCHEDULED</option>
                          <option value="PROPOSAL_SENT" className="bg-[#0F1322] text-white">PROPOSAL SENT</option>
                          <option value="WON" className="bg-[#0F1322] text-white">WON</option>
                          <option value="LOST" className="bg-[#0F1322] text-white">LOST</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-gray-400 text-xs">
                        {lead.assignedToName || <span className="text-gray-600 italic">Unassigned</span>}
                      </td>

                      <td className="py-4 px-5 text-gray-500 font-mono text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] transition-colors inline-block"
                        >
                          View Lead
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(lead.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors inline-block align-middle"
                          title="Delete Lead"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* PIPELINE KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {[
            { key: "NEW", title: "New", color: "border-cyan-500/40" },
            { key: "CONTACTED", title: "Contacted", color: "border-blue-500/40" },
            { key: "MEETING_SCHEDULED", title: "Meeting Scheduled", color: "border-purple-500/40" },
            { key: "PROPOSAL_SENT", title: "Proposal Sent", color: "border-amber-500/40" },
            { key: "WON", title: "Won", color: "border-emerald-500/40" },
            { key: "LOST", title: "Lost", color: "border-rose-500/40" },
          ].map((col) => {
            const columnLeads = leads.filter((l) => l.status === col.key);
            return (
              <div key={col.key} className={cn("rounded-2xl bg-[#0E121E] border p-3 flex flex-col min-h-[500px]", col.color)}>
                <div className="flex items-center justify-between pb-3 border-b border-[#1B2234] mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-300">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnLeads.length === 0 ? (
                    <div className="py-12 text-center text-[11px] text-gray-600 italic">No leads in stage</div>
                  ) : (
                    columnLeads.map((l) => (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl bg-[#141828] border border-[#1E2638] hover:border-gray-600 transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <Link href={`/admin/leads/${l.id}`} className="font-bold text-white text-xs hover:text-cyan-400">
                            {l.name}
                          </Link>
                          <select
                            value={l.status}
                            onChange={(e) => handleStatusChange(l.id, e.target.value)}
                            className="text-[10px] bg-black/40 border border-gray-700 rounded px-1.5 py-0.5 text-gray-300 focus:outline-none"
                          >
                            <option value="NEW">Move: New</option>
                            <option value="CONTACTED">Move: Contacted</option>
                            <option value="MEETING_SCHEDULED">Move: Meeting</option>
                            <option value="PROPOSAL_SENT">Move: Proposal</option>
                            <option value="WON">Move: Won</option>
                            <option value="LOST">Move: Lost</option>
                          </select>
                        </div>

                        <div className="text-[11px] text-gray-400 truncate">{l.businessName}</div>
                        <div className="text-[11px] text-cyan-300 truncate">{l.service}</div>
                        <div className="text-[10px] font-mono text-gray-500 flex items-center justify-between pt-1 border-t border-white/[0.04]">
                          <span>{l.budget}</span>
                          <span>{new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-red-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={24} />
              <h3 className="text-base font-bold text-white">Delete Lead Record?</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              This action permanently deletes this project enquiry, including all associated notes and activity audit history. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
