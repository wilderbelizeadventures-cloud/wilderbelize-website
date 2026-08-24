import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Resend } from "resend";

const FILE = path.join(process.cwd(), "data", "submissions.json");

type Submission = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  guests: string;
  subject: string;
  message: string;
  hotel: string;
  routeStops?: string;
  createdAt: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function generateCustomerInquiryHtml(data: Submission): string {
  const isRoute = data.type === "route";
  const headerTitle = isRoute ? "Route Request Received! 🗺️" : "Inquiry Received! 🌴";
  const tripSection = isRoute
    ? `<tr style="border-bottom:1px solid #edf2f0;">
        <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Selected Adventures</td>
        <td style="padding:10px 0;color:#0b3c26;font-weight:700;white-space:pre-line;">${data.routeStops || "N/A"}</td>
       </tr>`
    : `<tr style="border-bottom:1px solid #edf2f0;">
        <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Tour / Adventure</td>
        <td style="padding:10px 0;color:#0b3c26;font-weight:700;">${data.tour || "General Inquiry"}</td>
       </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${headerTitle}</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c2b26;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f4;padding:30px 10px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);border:1px solid #e2e8e5;">
        <tr><td style="background-color:#0b3c26;padding:32px 24px;text-align:center;border-bottom:4px solid #e5a93c;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;text-transform:uppercase;">Wilder Belize Adventures</h1>
          <p style="color:#e5a93c;margin:6px 0 0 0;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Placencia, Belize &bull; ${headerTitle}</p>
        </td></tr>
        <tr><td style="padding:24px 24px 12px 24px;text-align:center;">
          <div style="display:inline-block;background-color:#d1fae5;color:#065f46;border:1px solid #a7f3d0;padding:8px 18px;border-radius:50px;font-size:13px;font-weight:700;text-transform:uppercase;">✓ Request Received</div>
          <h2 style="margin:16px 0 6px 0;color:#0b3c26;font-size:22px;font-weight:800;">Thank you, ${data.name}!</h2>
          <p style="margin:0;color:#4a5d55;font-size:14px;line-height:1.5;">We received your inquiry and our Placencia team will get back to you within <strong>24 hours</strong>.</p>
        </td></tr>
        <tr><td style="padding:24px;">
          <h3 style="margin:0 0 14px 0;color:#0b3c26;font-size:14px;font-weight:800;text-transform:uppercase;border-bottom:2px solid #e2e8e5;padding-bottom:8px;">Your Request Details</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;border-collapse:collapse;">
            ${tripSection}
            <tr style="border-bottom:1px solid #edf2f0;">
              <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Preferred Date</td>
              <td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.date || "Not specified"}</td>
            </tr>
            <tr style="border-bottom:1px solid #edf2f0;">
              <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Guests</td>
              <td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.guests || "Not specified"}</td>
            </tr>
            ${data.hotel ? `<tr style="border-bottom:1px solid #edf2f0;">
              <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Hotel / Pickup</td>
              <td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.hotel}</td>
            </tr>` : ""}
            ${data.message ? `<tr>
              <td style="padding:10px 0;color:#6b7c75;font-weight:500;">Your Message</td>
              <td style="padding:10px 0;color:#1c2b26;">${data.message}</td>
            </tr>` : ""}
          </table>
        </td></tr>
        <tr><td style="background-color:#f0f4f2;padding:24px;text-align:center;border-top:1px solid #e2e8e5;">
          <p style="margin:0 0 8px 0;font-size:13px;color:#4a5d55;font-weight:600;">Need a faster reply?</p>
          <a href="https://wa.me/5016501003" style="display:inline-block;background-color:#0b3c26;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:50px;font-size:13px;font-weight:700;">WhatsApp Us (+501 650-1003)</a>
          <p style="margin:16px 0 0 0;font-size:11px;color:#8a9c94;">Wilder Belize Adventures &bull; Placencia Village, Stann Creek District, Belize &bull; wilderbelizeadventures@gmail.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function generateOwnerInquiryHtml(data: Submission): string {
  const isRoute = data.type === "route";
  const badgeLabel = isRoute ? "NEW ROUTE INQUIRY" : data.type === "contact" ? "NEW CONTACT MESSAGE" : "NEW BOOKING INQUIRY";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Inquiry – Wilder Belize</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c2b26;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f4;padding:30px 10px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);border:1px solid #e2e8e5;">
        <tr><td style="background-color:#0b3c26;padding:28px 24px;text-align:center;border-bottom:4px solid #10b981;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;">📨 ${badgeLabel}</h1>
          <p style="color:#a7f3d0;margin:6px 0 0 0;font-size:13px;font-weight:600;">Wilder Belize Adventures — Internal Notification</p>
        </td></tr>
        <tr><td style="padding:24px;text-align:center;background-color:#ecfdf5;border-bottom:1px solid #d1fae5;">
          <div style="display:inline-block;background-color:#059669;color:#fff;padding:6px 16px;border-radius:50px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">✓ ${badgeLabel}</div>
          <h2 style="margin:12px 0 4px 0;color:#065f46;font-size:20px;font-weight:800;">${data.name} wants to book!</h2>
          <p style="margin:0;color:#047857;font-size:13px;">Reply to: <a href="mailto:${data.email}" style="color:#047857;font-weight:700;">${data.email}</a></p>
        </td></tr>
        <tr><td style="padding:24px;">
          <h3 style="margin:0 0 14px 0;color:#0b3c26;font-size:14px;font-weight:800;text-transform:uppercase;border-bottom:2px solid #e2e8e5;padding-bottom:8px;">Customer &amp; Booking Details</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Name</td><td style="padding:10px 0;color:#0b3c26;font-weight:700;">${data.name}</td></tr>
            <tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Email</td><td style="padding:10px 0;"><a href="mailto:${data.email}" style="color:#0056b3;font-weight:600;">${data.email}</a></td></tr>
            <tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Phone</td><td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.phone || "Not provided"}</td></tr>
            ${isRoute
              ? `<tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Selected Adventures</td><td style="padding:10px 0;color:#0b3c26;font-weight:700;white-space:pre-line;">${data.routeStops || "N/A"}</td></tr>`
              : `<tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Tour</td><td style="padding:10px 0;color:#0b3c26;font-weight:700;">${data.tour || "General Inquiry"}</td></tr>`
            }
            <tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Preferred Date</td><td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.date || "Not specified"}</td></tr>
            <tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Guests</td><td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.guests || "Not specified"}</td></tr>
            ${data.hotel ? `<tr style="border-bottom:1px solid #edf2f0;"><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Hotel / Pickup</td><td style="padding:10px 0;color:#1c2b26;font-weight:600;">${data.hotel}</td></tr>` : ""}
            ${data.message ? `<tr><td style="padding:10px 0;color:#6b7c75;font-weight:500;">Message / Notes</td><td style="padding:10px 0;color:#1c2b26;">${data.message}</td></tr>` : ""}
          </table>
        </td></tr>
        <tr><td style="background-color:#f8faf9;padding:20px 24px;text-align:center;border-top:1px solid #e2e8e5;">
          <p style="margin:0;font-size:13px;color:#4a5d55;font-weight:600;">Contact ${data.name} to confirm availability &amp; send payment link.</p>
          ${data.phone ? `<a href="https://wa.me/${data.phone.replace(/[^0-9]/g,"")}" style="display:inline-block;margin-top:10px;background-color:#0b3c26;color:#fff;text-decoration:none;padding:10px 20px;border-radius:50px;font-size:13px;font-weight:700;">WhatsApp Customer</a>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  // Honeypot: bots fill the hidden "company" field. Silently accept and drop.
  if (str("company")) {
    return NextResponse.json({ ok: true });
  }

  const type = str("type") || "booking";
  const email = str("email");
  const name = str("name");
  const message = str("message");

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (type !== "newsletter" && !name) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if (type === "contact" && !message) {
    return NextResponse.json({ ok: false, error: "Please include a message." }, { status: 400 });
  }

  const entry: Submission = {
    id: crypto.randomUUID(),
    type,
    name,
    email,
    phone: str("phone"),
    tour: str("tour"),
    date: str("date"),
    guests: str("guests"),
    subject: str("subject"),
    message,
    hotel: str("hotel"),
    routeStops: str("routeStops"),
    createdAt: new Date().toISOString(),
  };

  // Persist submission to JSON file
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    let list: Submission[] = [];
    try {
      list = JSON.parse(await fs.readFile(FILE, "utf8"));
    } catch {
      list = [];
    }
    list.push(entry);
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error("[inquiry] failed to persist", err);
  }

  // Send emails via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "wilderbelizeadventures@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Wilder Belize Adventures <onboarding@resend.dev>";

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);

      const typeLabel = type === "route"
        ? `Custom Route Request`
        : type === "contact"
          ? `Contact Message`
          : `Tour Inquiry – ${entry.tour || "General"}`;

      // 1. Owner notification
      await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: email,
        subject: `📨 New ${typeLabel} from ${name}`,
        html: generateOwnerInquiryHtml(entry),
      });

      // 2. Customer acknowledgement
      await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: recipientEmail,
        subject: `We received your ${type === "route" ? "route request" : "inquiry"} – Wilder Belize Adventures`,
        html: generateCustomerInquiryHtml(entry),
      });

      console.log(`[inquiry] Emails sent via Resend for ${entry.type} from ${entry.email}`);
    } catch (emailErr) {
      console.error("[inquiry] Resend email failed:", emailErr);
      // Don't return error — submission is already saved, email failure is non-blocking
    }
  } else {
    console.warn("[inquiry] RESEND_API_KEY not set — emails not sent.");
  }

  console.log(`[inquiry] ${entry.type} from ${entry.email}${entry.tour ? ` — ${entry.tour}` : ""}`);
  return NextResponse.json({ ok: true });
}
