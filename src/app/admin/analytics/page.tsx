"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, MousePointerClick, Eye, Phone, MessageSquare, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalEvents: number;
  byType: Record<string, number>;
  recentEvents: Array<{
    id: string;
    eventType: string;
    path: string;
    createdAt: string;
  }>;
  timeSeries: Array<{ date: string; count: number }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const cards = [
    { label: "Page Views", key: "PAGE_VIEW", icon: Eye, color: "text-cyan-400" },
    { label: "Start Project Clicks", key: "START_PROJECT_CLICK", icon: MousePointerClick, color: "text-blue-400" },
    { label: "Book a Call Clicks", key: "BOOK_CALL_CLICK", icon: Calendar, color: "text-purple-400" },
    { label: "WhatsApp Clicks", key: "WHATSAPP_CLICK", icon: MessageSquare, color: "text-emerald-400" },
    { label: "Phone Inquiries", key: "PHONE_CLICK", icon: Phone, color: "text-amber-400" },
    { label: "Contact Submissions", key: "CONTACT_SUBMIT", icon: CheckCircle2, color: "text-cyan-300" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Business Telemetry & Event Analytics</h2>
          <p className="text-xs text-gray-400">Real-time visitor interactions, CTA conversion velocity, and call triggers.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-[#1B2234] self-start sm:self-auto">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                days === d ? "bg-cyan-400 text-black font-extrabold" : "text-gray-400 hover:text-white"
              )}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="p-12 text-center text-xs text-gray-500 animate-pulse">Loading telemetry...</div>
      ) : !data || data.totalEvents === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0E121E] border border-[#1B2234] text-center text-xs text-gray-500">
          <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Analytics data will appear here once tracking is recorded</h3>
          <p className="max-w-md mx-auto text-gray-500 text-[11px]">
            Public visitor clicks on Start Project, WhatsApp, phone numbers, and booking widgets stream directly into this dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {cards.map((c) => {
              const val = data.byType[c.key] || 0;
              return (
                <div key={c.key} className="p-4 rounded-2xl bg-[#0E121E] border border-[#1B2234]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</span>
                    <c.icon size={14} className={c.color} />
                  </div>
                  <div className={cn("text-2xl font-mono font-black", c.color)}>{val}</div>
                </div>
              );
            })}
          </div>

          {/* Activity Stream */}
          <div className="rounded-2xl bg-[#0E121E] border border-[#1B2234] p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Ingestion Events</h3>
            <div className="divide-y divide-[#1B2234] max-h-96 overflow-y-auto">
              {data.recentEvents.map((evt) => (
                <div key={evt.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white">{evt.eventType}</span>
                    <span className="text-gray-500 font-mono text-[11px]">{evt.path}</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-500">
                    {new Date(evt.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
