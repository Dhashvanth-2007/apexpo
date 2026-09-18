/**
 * APEXPO Calendar Integration
 * Currently a clean stub. Wire to Google Calendar API when credentials are configured.
 * Required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_CALENDAR_ID
 */

export interface CalendarEventPayload {
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  attendeeEmail: string;
  attendeeName: string;
  timezone: string;
}

export async function generateMeetingUrl(_payload: CalendarEventPayload): Promise<string | null> {
  const hasGoogleCredentials =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN;
  if (!hasGoogleCredentials) {
    console.log("[Calendar] Google Calendar not configured. Admin sets meeting URL manually.");
    return null;
  }
  // TODO: Implement Google Calendar API integration when credentials are ready
  return null;
}

export function formatAppointmentDateTime(date: string, time: string, timezone: string = "Asia/Kolkata"): string {
  try {
    return `${date} at ${time} (${timezone})`;
  } catch {
    return `${date} at ${time}`;
  }
}

export const CALL_SCOPE_LABELS: Record<string, string> = {
  DISCOVERY: "30-Min Strategy Consultation",
  ARCHITECTURE: "30-Min Strategy Consultation",
  GROWTH_AUDIT: "30-Min Strategy Consultation",
};

export const CALL_SCOPE_DURATION: Record<string, number> = {
  DISCOVERY: 30,
  ARCHITECTURE: 30,
  GROWTH_AUDIT: 30,
};
