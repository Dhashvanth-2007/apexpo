import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const leads = await db.leads.findMany();

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "NEW").length,
    contacted: leads.filter((l) => l.status === "CONTACTED").length,
    meetingScheduled: leads.filter((l) => l.status === "MEETING_SCHEDULED").length,
    proposalSent: leads.filter((l) => l.status === "PROPOSAL_SENT").length,
    won: leads.filter((l) => l.status === "WON").length,
    lost: leads.filter((l) => l.status === "LOST").length,
  };

  // Group by service
  const byService: Record<string, number> = {};
  leads.forEach((l) => {
    byService[l.service] = (byService[l.service] || 0) + 1;
  });

  // Group by budget
  const byBudget: Record<string, number> = {};
  leads.forEach((l) => {
    byBudget[l.budget] = (byBudget[l.budget] || 0) + 1;
  });

  // Group by status
  const byStatus: Record<string, number> = {};
  leads.forEach((l) => {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
  });

  // Time series over selected period
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const dateMap: Record<string, number> = {};
  
  // Initialize date keys
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dateMap[key] = 0;
  }

  leads.forEach((l) => {
    const leadDate = new Date(l.createdAt);
    if (leadDate >= cutoff) {
      const key = leadDate.toISOString().slice(0, 10);
      if (dateMap[key] !== undefined) {
        dateMap[key] += 1;
      } else {
        dateMap[key] = 1;
      }
    }
  });

  const timeSeries = Object.keys(dateMap).sort().map((date) => ({
    date,
    count: dateMap[date],
  }));

  return NextResponse.json({
    success: true,
    counts,
    byService,
    byBudget,
    byStatus,
    timeSeries,
    recentLeads: leads.slice(0, 8),
  });
}
