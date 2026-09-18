"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice: string;
  published: boolean;
  order: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<ServiceItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "Code2",
    startingPrice: "₹4,999",
    features: "Next.js Architecture, Sub-second Speeds, Free Service Included",
    published: true,
    order: 0,
  });

  const loadServices = () => {
    setLoading(true);
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setServices(data.services || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({
      title: "",
      slug: "",
      description: "",
      icon: "Code2",
      startingPrice: "₹4,999",
      features: "Next.js Architecture, Sub-second Speeds, Free Service Included",
      published: true,
      order: services.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setEditItem(svc);
    setForm({
      title: svc.title,
      slug: svc.slug,
      description: svc.description,
      icon: svc.icon,
      startingPrice: svc.startingPrice,
      features: svc.features.join(", "),
      published: svc.published,
      order: svc.order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
      };

      const url = editItem ? `/api/admin/services/${editItem.id}` : "/api/admin/services";
      const method = editItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        loadServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      loadServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/services/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      loadServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Services & Capabilities</h2>
          <p className="text-xs text-gray-400">Configure offerings, pricing anchors, and feature bullets displayed on the public site.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs tracking-wide self-start sm:self-auto hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,199,0.3)]"
        >
          <Plus size={14} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading service catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-gray-400 border-b border-[#1B2234] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Capability Title</th>
                  <th className="py-3.5 px-5">Starting Price</th>
                  <th className="py-3.5 px-5">Published</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2234]">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5 font-mono text-gray-400">#{svc.order}</td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{svc.title}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-sm">{svc.description}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-cyan-300 font-bold">{svc.startingPrice}</td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => togglePublish(svc.id, svc.published)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border transition-colors",
                          svc.published ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                        )}
                      >
                        {svc.published ? "LIVE" : "DRAFT"}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors inline-block"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(svc.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors inline-block"
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
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl bg-[#0F1322] border border-[#1E2638] p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">
              {editItem ? "Edit Service" : "Add Service"}
            </h3>

            <div>
              <label className="text-gray-400 block mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1">Starting Price</label>
                <input
                  type="text"
                  value={form.startingPrice}
                  onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Bullet Features (Comma Separated)</label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1B2234]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-cyan-400 text-black font-extrabold"
              >
                {saving ? "Saving..." : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1322] border border-red-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Service?</h3>
            <p className="text-xs text-gray-400">
              Removing this service will permanently remove it from the public services grid and database.
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
