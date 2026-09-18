import nodemailer from "nodemailer";

export interface LeadEmailPayload {
  leadId: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  createdAt: Date;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const receiverEmail = process.env.NOTIFICATION_RECEIVER_EMAIL || "apexpo008@gmail.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

export async function sendLeadNotifications(lead: LeadEmailPayload): Promise<{ success: boolean; simulated?: boolean }> {
  const transporter = getTransporter();
  const leadDashboardUrl = `${appUrl}/admin/leads`;

  // 1. Team Notification Email Content
  const adminSubject = `New APEXPO Project Enquiry — ${lead.businessName} (${lead.name})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #070913; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #00E5C7; margin: 0; font-size: 24px; letter-spacing: 2px;">APEXPO CRM</h2>
        <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">New Project Brief Transmission Received</p>
      </div>
      
      <div style="background-color: #0D101D; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #64748B; padding: 6px 0; width: 140px;">Client Name:</td><td style="color: #FFFFFF; font-weight: bold;">${lead.name}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Business / Org:</td><td style="color: #00E5C7; font-weight: bold;">${lead.businessName}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Work Email:</td><td><a href="mailto:${lead.email}" style="color: #6C5CE7; text-decoration: none;">${lead.email}</a></td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Phone / WhatsApp:</td><td><a href="tel:${lead.phone}" style="color: #FFFFFF; text-decoration: none;">${lead.phone}</a></td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Capability Needed:</td><td style="color: #FFFFFF;">${lead.service}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Budget Tier:</td><td style="color: #FFD166; font-weight: bold;">${lead.budget}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Submitted At:</td><td style="color: #94A3B8;">${new Date(lead.createdAt).toLocaleString()}</td></tr>
        </table>
      </div>

      <div style="background-color: #0D101D; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);">
        <p style="color: #64748B; font-size: 12px; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0;">Project Goals & Requirements:</p>
        <p style="color: #E2E8F0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${lead.message}</p>
      </div>

      <div style="text-align: center;">
        <a href="${leadDashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #00E5C7, #6C5CE7); color: #000000; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
          View Lead in Admin Dashboard →
        </a>
      </div>
    </div>
  `;

  // 2. Customer Acknowledgement Email Content
  const customerSubject = `Thanks for contacting APEXPO — We have received your project enquiry`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #070913; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #00E5C7; margin: 0; font-size: 24px; letter-spacing: 2px;">APEXPO</h2>
        <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">Engineering the Next Generation of Digital Experiences</p>
      </div>

      <p style="color: #E2E8F0; font-size: 15px; line-height: 1.6;">Hello <strong>${lead.name}</strong>,</p>
      <p style="color: #E2E8F0; font-size: 15px; line-height: 1.6;">
        Thank you for reaching out to APEXPO regarding your <strong>${lead.service}</strong> project for <strong>${lead.businessName}</strong>.
      </p>
      <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
        Our engineering directors and creative leads are currently reviewing your project requirements and scope. A partner will connect with you via email or WhatsApp to discuss architectural feasibility, timelines, and strategy.
      </p>

      <div style="background-color: #0D101D; padding: 16px 20px; border-radius: 8px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #94A3B8;">
        <strong style="color: #FFFFFF; display: block; margin-bottom: 4px;">Need immediate consultation?</strong>
        Reach our engineering hotline directly: 
        <a href="tel:+919342744740" style="color: #00E5C7; text-decoration: none; font-weight: bold;">+91 93427 44740</a> / 
        <a href="tel:+918903732621" style="color: #00E5C7; text-decoration: none; font-weight: bold;">+91 89037 32621</a>
      </div>

      <p style="color: #64748B; font-size: 12px; margin: 24px 0 0 0;">
        Warm regards,<br />
        <strong style="color: #FFFFFF;">The APEXPO Engineering Team</strong><br />
        <a href="${appUrl}" style="color: #6C5CE7; text-decoration: none;">${appUrl}</a>
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await Promise.all([
        transporter.sendMail({
          from: process.env.SMTP_FROM || `APEXPO Notifications <notifications@apexpo.digital>`,
          to: receiverEmail,
          subject: adminSubject,
          html: adminHtml,
        }),
        transporter.sendMail({
          from: process.env.SMTP_FROM || `APEXPO Team <hello@apexpo.digital>`,
          to: lead.email,
          subject: customerSubject,
          html: customerHtml,
        }),
      ]);
      return { success: true };
    } catch (err) {
      console.error("[Email Notification Error]", err);
      return { success: false };
    }
  } else {
    // Simulated logger when SMTP credentials are not yet configured in .env
    console.log("====================================================");
    console.log("[SIMULATED EMAIL DISPATCH] (Configure SMTP in .env for live sending)");
    console.log(`To APEXPO: ${receiverEmail}`);
    console.log(`Subject: ${adminSubject}`);
    console.log(`To Customer: ${lead.email}`);
    console.log(`Subject: ${customerSubject}`);
    console.log("====================================================");
    return { success: true, simulated: true };
  }
}

// ============================================================
// Appointment Notification Emails
// ============================================================

export interface AppointmentEmailPayload {
  appointmentId: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  callScope: string;
  callScopeLabel: string;
  duration: number;
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  meetingUrl: string | null;
}

export async function sendAppointmentNotifications(
  payload: AppointmentEmailPayload
): Promise<{ success: boolean; simulated?: boolean }> {
  const transporter = getTransporter();
  const adminDashboardUrl = `${appUrl}/admin/appointments/${payload.appointmentId}`;
  const displayTime = `${payload.appointmentDate} at ${payload.appointmentTime} IST`;

  // Internal team notification
  const teamSubject = `New APEXPO Call Booked — ${payload.companyName} (${payload.callScopeLabel})`;
  const teamHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #070913; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #00E5C7; margin: 0; font-size: 22px; letter-spacing: 2px;">APEXPO — New Call Booked</h2>
        <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">Strategy Session Confirmed</p>
      </div>
      <div style="background-color: #0D101D; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #64748B; padding: 6px 0; width: 140px;">Client:</td><td style="color: #FFFFFF; font-weight: bold;">${payload.clientName}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Company:</td><td style="color: #00E5C7; font-weight: bold;">${payload.companyName}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Email:</td><td><a href="mailto:${payload.email}" style="color: #6C5CE7;">${payload.email}</a></td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Phone:</td><td style="color: #FFFFFF;">${payload.phone}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Call Type:</td><td style="color: #FFD166; font-weight: bold;">${payload.callScopeLabel} (${payload.duration} min)</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Date & Time:</td><td style="color: #FFFFFF; font-weight: bold;">${displayTime}</td></tr>
          <tr><td style="color: #64748B; padding: 6px 0;">Timezone:</td><td style="color: #94A3B8;">${payload.timezone}</td></tr>
          ${payload.meetingUrl ? `<tr><td style="color: #64748B; padding: 6px 0;">Meeting URL:</td><td><a href="${payload.meetingUrl}" style="color: #00E5C7;">${payload.meetingUrl}</a></td></tr>` : ""}
        </table>
      </div>
      <div style="text-align: center;">
        <a href="${adminDashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #00E5C7, #6C5CE7); color: #000000; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
          View Appointment in Dashboard →
        </a>
      </div>
    </div>
  `;

  // Customer confirmation email
  const customerSubject = `Your APEXPO Strategy Call is Confirmed — ${displayTime}`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #070913; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #00E5C7; margin: 0; font-size: 24px; letter-spacing: 2px;">APEXPO</h2>
        <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">Your strategy session is confirmed.</p>
      </div>
      <p style="color: #E2E8F0; font-size: 15px; line-height: 1.6;">Hello <strong>${payload.clientName}</strong>,</p>
      <p style="color: #E2E8F0; font-size: 15px; line-height: 1.6;">
        Your <strong>${payload.callScopeLabel}</strong> (${payload.duration} minutes) has been confirmed.
      </p>
      <div style="background-color: #0D101D; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid rgba(0, 229, 199, 0.2);">
        <p style="color: #00E5C7; font-weight: bold; font-size: 13px; text-transform: uppercase; margin: 0 0 12px 0;">Session Details</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="color: #64748B; padding: 5px 0; width: 120px;">Date & Time:</td><td style="color: #FFFFFF; font-weight: bold;">${displayTime}</td></tr>
          <tr><td style="color: #64748B; padding: 5px 0;">Duration:</td><td style="color: #FFFFFF;">${payload.duration} minutes</td></tr>
          <tr><td style="color: #64748B; padding: 5px 0;">Session Type:</td><td style="color: #FFD166;">${payload.callScopeLabel}</td></tr>
          ${payload.meetingUrl ? `<tr><td style="color: #64748B; padding: 5px 0;">Meeting Link:</td><td><a href="${payload.meetingUrl}" style="color: #00E5C7; font-weight: bold;">${payload.meetingUrl}</a></td></tr>` : '<tr><td style="color: #64748B; padding: 5px 0;">Meeting Link:</td><td style="color: #94A3B8;">Will be shared 30 mins before the call.</td></tr>'}
        </table>
      </div>
      <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
        To reschedule or cancel, please contact us directly via WhatsApp or email.
      </p>
      <div style="background-color: #0D101D; padding: 16px 20px; border-radius: 8px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #94A3B8;">
        <strong style="color: #FFFFFF; display: block; margin-bottom: 4px;">APEXPO Direct Helpline</strong>
        <a href="tel:+919342744740" style="color: #00E5C7; text-decoration: none; font-weight: bold;">+91 93427 44740</a> /
        <a href="tel:+918903732621" style="color: #00E5C7; text-decoration: none; font-weight: bold;">+91 89037 32621</a>
      </div>
      <p style="color: #64748B; font-size: 12px; margin: 24px 0 0 0;">
        Warm regards,<br />
        <strong style="color: #FFFFFF;">The APEXPO Engineering Team</strong><br />
        <a href="${appUrl}" style="color: #6C5CE7; text-decoration: none;">${appUrl}</a>
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await Promise.all([
        transporter.sendMail({
          from: process.env.SMTP_FROM || `APEXPO Notifications <notifications@apexpo.digital>`,
          to: receiverEmail,
          subject: teamSubject,
          html: teamHtml,
        }),
        transporter.sendMail({
          from: process.env.SMTP_FROM || `APEXPO Team <hello@apexpo.digital>`,
          to: payload.email,
          subject: customerSubject,
          html: customerHtml,
        }),
      ]);
      return { success: true };
    } catch (err) {
      console.error("[Appointment Email Notification Error]", err);
      return { success: false };
    }
  } else {
    console.log("====================================================");
    console.log("[SIMULATED APPOINTMENT EMAIL] (Configure SMTP in .env)");
    console.log(`To APEXPO: ${receiverEmail} | Subject: ${teamSubject}`);
    console.log(`To Customer: ${payload.email} | Subject: ${customerSubject}`);
    console.log("====================================================");
    return { success: true, simulated: true };
  }
}
