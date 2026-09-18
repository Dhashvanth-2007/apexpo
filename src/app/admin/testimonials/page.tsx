"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialItem {
  id: string;
  name: string;
  business: string;
  role: string;
  review: string;
  rating: number;
  metrics?: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    business: "",
    role: "Founder & CEO",
    review: "",
    rating: 5,
    metrics: "Verified Client",
    published: false,
  });

  const loadTestimonials = () => {
    setLoading(true);
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTestimonials(data.testimonials || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      name: "",
      business: "",
      role: "Founder & CEO",
      review: "",
      rating: 5,
      metrics: "Verified Client",
      published: false,
    });
    setModalOpen(true);
  };

  const openEdit = (item: TestimonialItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      business: item.business,
      role: item.role,
      review: item.review,
      rating: item.rating,
      metrics: item.metrics || "Verified Client",
      published: item.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editItem ? `/api/admin/testimonials/${editItem.id}` : "/api/admin/testimonials";
      const method = editItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        loadTestimonials();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Client Testimonials</h2>
          <p className="text-xs text-gray-400">
            Publish authentic client reviews. If no testimonials are published, the public site displays: &ldquo;Client stories coming soon.&rdquo;
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs tracking-wide self-start sm:self-auto hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,199,0.3)]"
        >
          <Plus size={14} />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500">
            No client stories have been added yet. Real endorsements will appear here as client projects wrap up.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Client & Business</th>
                  <th className="py-3.5 px-5">Rating</th>
                  <th className="py-3.5 px-5">Review Content</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-[11px] text-gray-400">{t.business} • {t.role}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-300 max-w-sm truncate">
                      &ldquo;{t.review}&rdquo;
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => togglePublish(t.id, t.published)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border transition-colors",
                          t.published ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                        )}
                      >
                        {t.published ? "LIVE" : "DRAFT / HIDDEN"}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
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
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl bg-[#0F1322] border border-[#1E2638] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">
              {editItem ? "Edit Testimonial" : "Add Testimonial"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Business / Company *</label>
                <input
                  type="text"
                  required
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Star Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Review Text *</label>
              <textarea
                rows={4}
                required
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pubTest"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded bg-[#0F1322] border-gray-700 text-cyan-400"
              />
              <label htmlFor="pubTest" className="text-white cursor-pointer">Publish on public website</label>
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
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-cyan-400 text-black font-extrabold"
              >
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-red-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Testimonial?</h3>
            <p className="text-xs text-gray-400">This action permanently deletes this client story.</p>
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
