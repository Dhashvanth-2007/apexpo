"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowRight, Check, Send } from "lucide-react";
import { COMPANY_DETAILS, SERVICES } from "@/lib/constants";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="relative z-10 bg-[#040508] border-t border-border-glass pt-24 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-border-glass">
          {/* Col 1: Brand & Newsletter (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5">
                <img
                  src="/assets/logo.png"
                  alt="Apexpo Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(108,92,231,0.6)]"
                />
              </div>
              <span className="text-2xl font-black tracking-widest text-white">APEXPO</span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed max-w-md font-light">
              Engineering the next generation of cinematic digital experiences, high-converting architectures, and intelligent web applications.
            </p>

            {/* Newsletter */}
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
                Join our private engineering dispatch
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-surface-glass border border-border-glass text-white text-xs placeholder:text-text-subtle focus:outline-none focus:border-accent-secondary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-5 py-3 rounded-xl bg-gradient-accent text-black font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,199,0.3)] hover:opacity-90 transition-opacity"
                >
                  {subscribed ? <Check size={14} /> : <Send size={14} />}
                  <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Navigation Quick Links (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Navigation
            </p>
            <ul className="grid grid-cols-2 gap-2 text-xs text-text-muted">
              <li><a href="/services" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>Services</a></li>
              <li><a href="/work" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>Work</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>Pricing</a></li>
              <li><a href="/about" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>About</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>Contact</a></li>
              <li><a href="/book-a-call" className="hover:text-white transition-colors flex items-center gap-1 py-1"><span className="text-accent-secondary/50">›</span>Book a Call</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiries (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Direct Contact
            </p>
            <div className="flex flex-col gap-2 text-xs text-text-muted">
              <p className="text-white font-medium">{COMPANY_DETAILS.address}</p>
              <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-accent-secondary transition-colors">
                {COMPANY_DETAILS.email}
              </a>
              <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:text-accent-secondary transition-colors">
                {COMPANY_DETAILS.phone}
              </a>
              <a href={`tel:${COMPANY_DETAILS.secondaryPhone}`} className="hover:text-accent-secondary transition-colors">
                {COMPANY_DETAILS.secondaryPhone}
              </a>
              <div className="flex items-center gap-4 mt-3">
                <a href={COMPANY_DETAILS.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href={COMPANY_DETAILS.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href={COMPANY_DETAILS.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <p>© {new Date().getFullYear()} APEXPO. Websites. Apps. Digital Experiences. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-text-muted transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-text-muted transition-colors">Terms of Service</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors ml-4"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
