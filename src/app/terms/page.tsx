import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | APEXPO",
  description: "Terms of Service governing project agreements and digital development services by APEXPO.",
};

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen text-text-muted">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-accent-secondary mb-8 hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-4 text-accent-secondary">
          <FileText size={22} />
          <span className="text-xs uppercase font-bold tracking-widest">Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-sm leading-relaxed font-light">
          <p>
            By accessing the APEXPO platform, initiating an inquiry, or commissioning engineering services, you agree to comply with and be bound by the following terms.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">1. Project Scoping & Pricing Baseline</h2>
          <p>
            All listed pricing tiers (e.g. Starting from ₹4,999) reflect minimum entry baselines based on project complexity and technical scope, rather than arbitrary page counts. Formal contracts and milestone roadmaps are executed individually prior to sprint kickoffs.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">2. Intellectual Property & Ownership</h2>
          <p>
            Upon receipt of final project settlement, the client retains 100% full intellectual property ownership of the final codebase, assets, custom graphics, and production database schemas engineered for their platform.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">3. Lifetime Free Service Guarantee</h2>
          <p>
            APEXPO provides ongoing complimentary security patches, critical dependency upgrades, and minor styling updates on eligible deployed platforms, subject to hosting compliance and standard SLA protocols.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">4. Governing Law</h2>
          <p>
            These terms are governed in accordance with the laws of India. For commercial contracts or legal notices, contact our administration office at <a href="mailto:apexpo008@gmail.com" className="text-accent-secondary hover:underline">apexpo008@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
