"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, FolderGit2, Wrench, MessageSquareQuote, 
  BarChart3, UserCog, Settings, LogOut, Menu, X, Bell, ExternalLink, 
  Search, ShieldCheck, Check, ArrowRight, CalendarCheck, UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
  { label: "Clients", href: "/admin/clients", icon: UserCircle },
  { label: "Leads", href: "/admin/leads", icon: Users, showBadge: true },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Team", href: "/admin/team", icon: UserCog },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface LeadNotification {
  id: string;
  name: string;
  businessName: string;
  service: string;
  createdAt: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminUser, setAdminUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);
  const [recentNewLeads, setRecentNewLeads] = useState<LeadNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; subtitle: string; href: string }[]>([]);

  // Skip admin chrome on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    // Fetch current admin user
    fetch("/api/admin/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) setAdminUser(data.user);
      })
      .catch(() => {});

    // Fetch lead notifications & unread count
    fetch("/api/admin/leads?status=NEW")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.leads) {
          setNewLeadsCount(data.leads.length);
          setRecentNewLeads(data.leads.slice(0, 5));
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Global search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: { type: string; title: string; subtitle: string; href: string }[] = [];

    // Search leads
    fetch(`/api/admin/leads?search=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) {
          data.leads.slice(0, 5).forEach((l: any) => {
            results.push({
              type: "LEAD",
              title: l.name + " (" + l.businessName + ")",
              subtitle: l.service + " • " + l.status,
              href: `/admin/leads/${l.id}`,
            });
          });
        }
        setSearchResults([...results]);
      })
      .catch(() => {});
  }, [searchQuery]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview Dashboard";
    if (pathname === "/admin/leads") return "Lead Management & CRM";
    if (pathname.startsWith("/admin/leads/")) return "Lead Specification";
    if (pathname === "/admin/projects") return "Portfolio Projects";
    if (pathname === "/admin/projects/new") return "Add New Project";
    if (pathname.includes("/edit")) return "Edit Project";
    if (pathname === "/admin/services") return "Service Management";
    if (pathname === "/admin/testimonials") return "Client Testimonials";
    if (pathname === "/admin/analytics") return "Traffic & Business Telemetry";
    if (pathname === "/admin/team") return "Team & Access Control";
    if (pathname === "/admin/settings") return "Company Settings";
    return "APEXPO Operations";
  };

  return (
    <div className="min-h-screen bg-[#080A11] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-[#1B2234] bg-[#0C0F1D] p-5 shrink-0 fixed inset-y-0 left-0 z-40">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#1B2234] mb-6">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center p-1">
              <img src="/assets/logo.png" alt="Apexpo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-base font-black tracking-widest text-white block">APEXPO</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                OPERATIONS CRM
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150",
                    isActive
                      ? "bg-cyan-400 text-black font-extrabold shadow-[0_0_20px_rgba(0,229,199,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {item.showBadge && newLeadsCount > 0 && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-mono font-bold",
                        isActive ? "bg-black text-cyan-400" : "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                      )}
                    >
                      ● {newLeadsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: Admin Profile & Logout */}
        <div className="pt-4 border-t border-[#1B2234] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} /> View Live Website
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">↗</span>
          </Link>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-[#1B2234] flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.name || "Admin Partner"}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider truncate">
                {adminUser?.role || "ADMIN"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-[#1B2234] bg-[#0C0F1D]/90 backdrop-blur-xl px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-[#1B2234] text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              <Search size={14} />
              <span>Search leads, projects...</span>
              <kbd className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors border border-[#1B2234]"
              >
                <Bell size={16} />
                {newLeadsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F1322] border border-[#1E2638] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E2638] mb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      New Enquiries ({newLeadsCount})
                    </span>
                    <Link
                      href="/admin/leads"
                      onClick={() => setNotifOpen(false)}
                      className="text-[10px] text-cyan-400 hover:underline font-mono"
                    >
                      View All Leads
                    </Link>
                  </div>

                  {recentNewLeads.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                      No unread enquiries. All leads are reviewed!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentNewLeads.map((nl) => (
                        <Link
                          key={nl.id}
                          href={`/admin/leads/${nl.id}`}
                          onClick={() => setNotifOpen(false)}
                          className="block p-2.5 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{nl.name}</span>
                            <span className="text-[10px] text-cyan-400 font-mono">NEW</span>
                          </div>
                          <div className="text-[11px] text-gray-400 truncate">{nl.businessName} • {nl.service}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* View Live Website Button */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#1B2234] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-[#0F1322] border border-[#1E2638] shadow-2xl p-5 overflow-hidden">
              <div className="flex items-center gap-3 pb-3 border-b border-[#1E2638]">
                <Search size={18} className="text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search leads by customer name, business, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-500"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
                {searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    {searchQuery ? "No matching leads found." : "Type a query to search CRM records."}
                  </div>
                ) : (
                  searchResults.map((r, i) => (
                    <Link
                      key={i}
                      href={r.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{r.title}</div>
                        <div className="text-[11px] text-gray-400">{r.subtitle}</div>
                      </div>
                      <ArrowRight size={14} className="text-gray-400" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col">
            <div className="p-5 border-b border-[#1B2234] flex items-center justify-between bg-[#0C0F1D]">
              <span className="font-bold text-white">APEXPO Control Center</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <nav className="p-5 space-y-2 flex-1 overflow-y-auto bg-[#0C0F1D]">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl text-sm font-semibold",
                    pathname === item.href ? "bg-cyan-400 text-black font-extrabold" : "text-gray-300 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.showBadge && newLeadsCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono">
                      {newLeadsCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-5 border-t border-[#1B2234] bg-[#0C0F1D]">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="p-5 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
