import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | APEXPO",
  description: "Privacy and data protection policies for APEXPO clients and website visitors.",
};

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen text-text-muted">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-accent-secondary mb-8 hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-4 text-accent-secondary">
          <Shield size={22} />
          <span className="text-xs uppercase font-bold tracking-widest">Legal & Security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed font-light">
          <p>
            At APEXPO Technologies, protecting the privacy and confidentiality of our clients, prospective business partners, and website visitors is fundamental to our engineering ethos.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">1. Information We Collect</h2>
          <p>
            When you submit a project brief or schedule a consultation, we collect your Full Name, Business Name, Work Email, Phone / WhatsApp contact number, and your project requirements. We never collect or store sensitive payment credentials on our public servers.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">2. How Information is Used</h2>
          <p>
            Collected contact data is exclusively utilized to evaluate project scope, prepare architectural proposals, and communicate project delivery milestones. We do not sell, rent, or distribute your information to any third-party marketers or advertisers.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">3. Data Security & Storage</h2>
          <p>
            All data transmissions are protected via industry-standard TLS encryption. Information stored in our PostgreSQL database and CRM systems is safeguarded behind salted password hashing and secure tokenized authentication.
          </p>
          <h2 className="text-lg font-bold text-white pt-4">4. Contact Our Data Office</h2>
          <p>
            For inquiries regarding data privacy or to request the deletion of your enquiry record, contact us directly at <a href="mailto:apexpo008@gmail.com" className="text-accent-secondary hover:underline">apexpo008@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
