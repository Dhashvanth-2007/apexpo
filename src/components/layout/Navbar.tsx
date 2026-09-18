"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall, ArrowUpRight } from "lucide-react";
import { COMPANY_DETAILS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "SERVICES", href: "/services" },
  { label: "OUR WORK", href: "/work" },
  { label: "PRICING", href: "/pricing" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12",
          scrolled
            ? "bg-[#05060A]/90 backdrop-blur-xl border-b border-border-glass py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3 z-50">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center p-0.5 transition-all duration-300 group-hover:scale-105">
              <img
                src="/assets/logo.png"
                alt="Apexpo Logo"
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(108,92,231,0.6)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-white group-hover:text-accent-secondary transition-colors">
                APEXPO
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 bg-surface-glass border border-border-glass px-6 py-2 rounded-full backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/book-a-call"
              className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-surface-glass border border-accent-secondary/40 text-xs font-bold uppercase tracking-wider text-white hover:border-accent-secondary transition-all duration-300 shadow-[0_0_15px_rgba(0,229,199,0.15)] hover:shadow-[0_0_25px_rgba(0,229,199,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                BOOK A CALL
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-surface-glass border border-border-glass text-white focus:outline-none z-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#05060A]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 md:hidden animate-fade-in">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary mb-2">
              Navigation
            </p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-3xl font-bold tracking-tight text-white/90 hover:text-accent-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-border-glass">
            <Link
              href="/book-a-call"
              onClick={closeMenu}
              className="w-full text-center py-3.5 rounded-xl bg-gradient-accent text-black font-extrabold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(0,229,199,0.5)]"
            >
              BOOK A CALL
            </Link>
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-glass border border-border-glass text-white text-sm font-medium"
            >
              <PhoneCall size={16} />
              {COMPANY_DETAILS.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
};
