"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Lock,
  User,
  Key,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin Credentials State
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credSaving, setCredSaving] = useState(false);
  const [credSuccess, setCredSuccess] = useState<string | null>(null);
  const [credError, setCredError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSettings(data.settings || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch("/api/admin/settings/credentials")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.username) {
          setCurrentUsername(data.username);
          setNewUsername(data.username);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);
    setCredSuccess(null);

    if (!currentPassword) {
      setCredError("Please enter your current password to authorize changes.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredError("New password must be at least 6 characters in length.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredError("New password and confirm password do not match.");
      return;
    }

    if (newUsername.trim() === currentUsername && !newPassword) {
      setCredError("No credential changes were provided.");
      return;
    }

    setCredSaving(true);

    try {
      const res = await fetch("/api/admin/settings/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() !== currentUsername ? newUsername.trim() : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update credentials");
      }

      setCredSuccess("Admin login credentials updated successfully!");
      if (data.username) {
        setCurrentUsername(data.username);
        setNewUsername(data.username);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setCredSuccess(null), 5000);
    } catch (err: unknown) {
      setCredError(err instanceof Error ? err.message : "Failed to update credentials");
    } finally {
      setCredSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Agency Configuration & Settings</h2>
          <p className="text-xs text-gray-400">Manage admin credentials, company contact points, social profiles, and response channels.</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={14} />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      {/* SECTION 1: Admin Security & Login Credentials */}
      <div className="p-6 rounded-2xl bg-[#0E121E] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B2234] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span>Admin Login Credentials (Username & Password)</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Change the administrative username and password used to access the APEXPO control center.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Active Login:</span>
            <span className="font-bold">@{currentUsername}</span>
          </div>
        </div>

        {credSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        {credError && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">
                Admin Username <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Letters, numbers, underscores, and hyphens (min 3 chars).</span>
            </div>

            <div>
              <label className="text-gray-300 block mb-1 font-semibold">
                Current Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Required to save changes"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Your existing password to verify identity.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">
                New Password <span className="text-gray-500 font-normal">(Leave blank to keep unchanged)</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 block mb-1 font-semibold">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={!newPassword}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-[#1B2234] text-white focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={credSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-accent text-black font-extrabold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] disabled:opacity-50"
            >
              <Lock size={14} />
              <span>{credSaving ? "Updating Credentials..." : "Update Login Credentials"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* GENERAL AGENCY SETTINGS */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 2: Company Profile */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3 flex items-center gap-2">
            <Globe size={15} className="text-cyan-400" />
            <span>Company Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={settings.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Official Company Email</label>
              <input
                type="email"
                value={settings.companyEmail || ""}
                onChange={(e) => handleChange("companyEmail", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">Primary Phone</label>
              <input
                type="text"
                value={settings.companyPhone1 || ""}
                onChange={(e) => handleChange("companyPhone1", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Secondary Phone</label>
              <input
                type="text"
                value={settings.companyPhone2 || ""}
                onChange={(e) => handleChange("companyPhone2", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Physical / Operating Address</label>
            <input
              type="text"
              value={settings.companyAddress || ""}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: WhatsApp & Calendar Integration */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3 flex items-center gap-2">
            <MessageSquare size={15} className="text-emerald-400" />
            <span>WhatsApp & Calendar Integration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">WhatsApp Direct Number (With Country Code)</label>
              <input
                type="text"
                value={settings.whatsappNumber || ""}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="919342744740"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Calendar Provider URL (Cal.com / Calendly)</label>
              <input
                type="url"
                value={settings.calendarUrl || ""}
                onChange={(e) => handleChange("calendarUrl", e.target.value)}
                placeholder="https://cal.com/apexpo/discovery"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Default Pre-filled WhatsApp Message</label>
            <input
              type="text"
              value={settings.whatsappMessage || ""}
              onChange={(e) => handleChange("whatsappMessage", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Lead Notifications & SEO */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3 flex items-center gap-2">
            <Mail size={15} className="text-amber-400" />
            <span>Lead Notifications & Default SEO</span>
          </h3>

          <div>
            <label className="text-gray-400 block mb-1">Team Alert Notification Email</label>
            <input
              type="email"
              value={settings.leadNotificationEmail || ""}
              onChange={(e) => handleChange("leadNotificationEmail", e.target.value)}
              placeholder="apexpo008@gmail.com"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">Default SEO Meta Title</label>
              <input
                type="text"
                value={settings.seoTitle || ""}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Default SEO Meta Description</label>
              <input
                type="text"
                value={settings.seoDescription || ""}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Media Links */}
        <div className="p-6 rounded-2xl bg-[#0E121E] border border-[#1B2234] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#1B2234] pb-3">
            Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 block mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram || ""}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin || ""}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">GitHub URL</label>
              <input
                type="url"
                value={settings.github || ""}
                onChange={(e) => handleChange("github", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-[#1B2234] text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,199,0.3)] disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
