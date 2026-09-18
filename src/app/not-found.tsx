import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#05060A] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center text-accent-secondary mx-auto shadow-[0_0_30px_rgba(0,229,199,0.3)]">
          <Compass size={32} />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-secondary block">
          Error 404 · Coordinates Invalid
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs text-text-muted leading-relaxed font-light">
          The digital architecture or project coordinate you requested does not exist or has been relocated to another sector.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,199,0.4)] hover:scale-105 transition-transform"
          >
            <ArrowLeft size={14} />
            <span>Return to Flagship Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
