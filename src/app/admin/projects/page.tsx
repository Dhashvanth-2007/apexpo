"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  clientOrConcept: string;
  published: boolean;
  order: number;
  heroImage: string;
  results?: string | null;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadProjects = () => {
    setLoading(true);
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProjects(data.projects || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      if (res.ok) loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        loadProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Portfolio Projects</h2>
          <p className="text-xs text-gray-400">Manage case studies and concept showcases displayed on the public website.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs tracking-wide self-start sm:self-auto hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,199,0.3)]"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </Link>
      </div>

      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading portfolio records...</div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500">No portfolio projects have been added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Preview</th>
                  <th className="py-3.5 px-5">Project Name & Category</th>
                  <th className="py-3.5 px-5">Type Classification</th>
                  <th className="py-3.5 px-5">Published</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-5">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#1B2234] bg-black">
                        <img src={proj.heroImage} alt={proj.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-bold text-white text-sm">{proj.name}</div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{proj.category}</span>
                    </td>
                    <td className="py-3 px-5">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                        proj.clientOrConcept === "Concept Project" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                      )}>
                        {proj.clientOrConcept}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <button
                        onClick={() => togglePublish(proj.id, proj.published)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border transition-colors",
                          proj.published ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                        )}
                      >
                        {proj.published ? "PUBLISHED" : "DRAFT / HIDDEN"}
                      </button>
                    </td>
                    <td className="py-3 px-5 font-mono text-gray-400 text-[11px] truncate max-w-[150px]">
                      {proj.slug}
                    </td>
                    <td className="py-3 px-5 text-right space-x-2">
                      <Link
                        href={`/work/${proj.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors inline-block align-middle"
                        title="View on Public Site"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/projects/${proj.id}/edit`}
                        className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors inline-block align-middle"
                        title="Edit Project"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(proj.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors inline-block align-middle"
                        title="Delete Project"
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

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-red-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Portfolio Project?</h3>
            <p className="text-xs text-gray-400">
              This action will remove the project from the public showcase and database permanently.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
