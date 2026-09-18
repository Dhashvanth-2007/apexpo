"use client";

import React, { useState, useEffect } from "react";
import { Plus, Shield, User, Trash2, Edit2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEAM_MEMBER" | string;
  active: boolean;
  createdAt: string;
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const loadTeam = () => {
    setLoading(true);
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTeam(data.team || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create team member");

      setModalOpen(false);
      setForm({ name: "", email: "", password: "", role: "ADMIN" });
      loadTeam();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRole = async (member: TeamMember) => {
    const nextRole = member.role === "ADMIN" ? "SUPER_ADMIN" : member.role === "SUPER_ADMIN" ? "TEAM_MEMBER" : "ADMIN";
    try {
      await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      loadTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) loadTeam();
      else {
        const json = await res.json();
        alert(json.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Team & Access Control</h2>
          <p className="text-xs text-gray-400">Manage administrator privileges, access tiers, and partner logins.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs tracking-wide self-start sm:self-auto hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,199,0.3)]"
        >
          <Plus size={14} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Permissions Guide Banner */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#1B2234] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-cyan-400 font-mono">SUPER_ADMIN</div>
          <p className="text-gray-400 text-[11px]">Full access to system, team management, company settings, and lead deletions.</p>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-purple-400 font-mono">ADMIN</div>
          <p className="text-gray-400 text-[11px]">Manage CRM leads, projects, services, testimonials, and view analytics.</p>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-blue-400 font-mono">TEAM_MEMBER</div>
          <p className="text-gray-400 text-[11px]">View assigned leads, advance pipeline status, and add internal notes.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading team members...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Name & Email</th>
                  <th className="py-3.5 px-5">Access Level</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Created</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{member.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{member.email}</div>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleRole(member)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors",
                          member.role === "SUPER_ADMIN" ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : member.role === "ADMIN" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        )}
                        title="Click to cycle role"
                      >
                        {member.role}
                      </button>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-500 font-mono text-[11px]">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-[#1E2638] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Add Team Member</h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="text-gray-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Initial Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Access Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1322] border border-[#1B2234] text-white focus:outline-none"
              >
                <option value="ADMIN">ADMIN (CRM & Content Manager)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Privileges)</option>
                <option value="TEAM_MEMBER">TEAM_MEMBER (Assigned Leads Only)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1B2234]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-cyan-400 text-black font-extrabold"
              >
                {submitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
