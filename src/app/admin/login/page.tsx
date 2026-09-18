"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Authentication failed");
      }

      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05060A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img src="/assets/logo.png" alt="Apexpo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-widest text-white">APEXPO</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin CRM Access</h1>
          <p className="text-xs text-text-muted font-light mt-1">
            Sign in with authorized username and password
          </p>
        </div>

        <div className="rounded-3xl p-8 bg-[#090C1A] border border-border-glass backdrop-blur-2xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Admin Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-glass border border-border-glass text-white text-xs placeholder:text-text-subtle focus:outline-none focus:border-accent-secondary transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block mb-2">
                Secret Key / Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-glass border border-border-glass text-white text-xs placeholder:text-text-subtle focus:outline-none focus:border-accent-secondary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:shadow-[0_0_30px_rgba(0,229,199,0.6)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Verifying..." : "Authenticate Session"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-glass/60 text-center">
            <p className="text-[11px] text-text-subtle font-light">
              Default admin: <code className="text-white font-mono">admin</code> / <code className="text-white font-mono">ApexpoAdmin2027!</code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
