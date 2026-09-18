"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "WEBSITES",
    description: "",
    clientOrConcept: "Concept Project",
    services: "Responsive Web Development, UI/UX Design",
    technologies: "Next.js 14, Tailwind CSS, TypeScript",
    heroImage: "/assets/vanguard-cover.png",
    gallery: "/assets/vanguard-cover.png",
    problem: "",
    solution: "",
    features: "High-Performance Core, Mobile First UI, Frictionless Conversions",
    results: "+200% conversion uplift",
    liveUrl: "",
    published: true,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...form,
        services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        gallery: form.gallery.split(",").map((g) => g.trim()).filter(Boolean),
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      };

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create project");

      router.push("/admin/projects");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Create Portfolio Project</h2>
          <p className="text-xs text-gray-400">Add a new technical case study or concept showcase to the public APEXPO site.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Project Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Vanguard Athletic Club"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Slug (URL)</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="vanguard-athletic-club (auto-generated if blank)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1322] border border-[#1B2234] text-white focus:outline-none"
            >
              <option value="WEBSITES">WEBSITES</option>
              <option value="MOBILE APPS">MOBILE APPS</option>
              <option value="WEB APPS">WEB APPS</option>
              <option value="E-COMMERCE">E-COMMERCE</option>
              <option value="EVENTS">EVENTS</option>
              <option value="SCHOOL">SCHOOL</option>
              <option value="AI">AI</option>
              <option value="PORTFOLIO">PORTFOLIO</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Classification Badge *</label>
            <select
              value={form.clientOrConcept}
              onChange={(e) => setForm({ ...form, clientOrConcept: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1322] border border-[#1B2234] text-white focus:outline-none"
            >
              <option value="Concept Project">Concept Project (Ethical Showcase)</option>
              <option value="Live Demo">Live Demo</option>
              <option value="Client Project">Client Project</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Overview Description *</label>
          <textarea
            rows={3}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="High-level engineering narrative and customer deliverables..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Services Delivered (Comma Separated)</label>
            <input
              type="text"
              value={form.services}
              onChange={(e) => setForm({ ...form, services: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Tech Stack (Comma Separated)</label>
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Hero Image URL</label>
            <input
              type="text"
              value={form.heroImage}
              onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Live URL (Optional)</label>
            <input
              type="url"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Business Problem</label>
            <textarea
              rows={2}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              placeholder="What friction was the client experiencing?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Our Technical Solution</label>
            <textarea
              rows={2}
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              placeholder="How did APEXPO solve it?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Key Features (Comma Separated)</label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">Results & Metrics</label>
            <input
              type="text"
              value={form.results}
              onChange={(e) => setForm({ ...form, results: e.target.value })}
              placeholder="+240% mobile class bookings, sub-second latency"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded bg-[#0F1322] border-gray-700 text-cyan-400 focus:ring-0"
            />
            <span className="text-white font-semibold">Publish immediately on website</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#1B2234]">
          <Link href="/admin/projects" className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold hover:bg-cyan-300 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{submitting ? "Saving..." : "Publish Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
