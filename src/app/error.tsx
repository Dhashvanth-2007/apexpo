"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#05060A] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <AlertTriangle size={32} />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 block">
          Telemetry Interrupted
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          System Anomaly Encountered
        </h1>
        <p className="text-xs text-text-muted leading-relaxed font-light">
          An unexpected transmission exception occurred. Our engineering telemetry has logged this event. Please retry or return to the main platform.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-glass border border-border-glass text-white font-bold text-xs hover:border-white transition-colors"
          >
            <RefreshCw size={13} />
            <span>Retry Connection</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,199,0.4)]"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
