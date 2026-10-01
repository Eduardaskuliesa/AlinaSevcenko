"use server";
import { headers } from "next/headers";
import transporter from "@/app/services/nodemailer";
import { logger } from "@/app/utils/logger";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@alinasavcenko.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort throttle per server instance: 5 messages per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // honeypot, must stay empty
}

export type ContactResult =
  | { success: true }
  | {
      success: false;
      error: "INVALID_INPUT" | "TOO_MANY_REQUESTS" | "SEND_FAILED";
    };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) return true;
  recent.set(ip, [...hits, now]);
  return false;
}

export async function sendContactMessage(
  data: ContactFormData
): Promise<ContactResult> {
  // Bots fill hidden fields; pretend success so they don't retry.
  if (data?.website) return { success: true };

  const name = singleLine(String(data?.name ?? "")).slice(0, 100);
  const email = singleLine(String(data?.email ?? ""));
  const subject = singleLine(String(data?.subject ?? "")).slice(0, 150);
  const message = String(data?.message ?? "").trim();

  if (
    !name ||
    !EMAIL_REGEX.test(email) ||
    email.length > 254 ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return { success: false, error: "INVALID_INPUT" };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return { success: false, error: "TOO_MANY_REQUESTS" };
  }

  const mailSubject = `Nauja žinutė iš svetainės: ${subject || name}`;

  try {
    await transporter.sendMail({
      from: `Alina Savcenko <no-reply@alinasavcenko.com>`,
      to: CONTACT_EMAIL,
      replyTo: { name, address: email },
      subject: mailSubject,
      text: `Vardas: ${name}\nEl. paštas: ${email}\nTema: ${
        subject || "-"
      }\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="margin: 0 0 16px;">Nauja žinutė iš kontaktų formos</h2>
          <p style="margin: 4px 0;"><strong>Vardas:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 4px 0;"><strong>El. paštas:</strong> ${escapeHtml(email)}</p>
          <p style="margin: 4px 0;"><strong>Tema:</strong> ${escapeHtml(subject || "-")}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
          <p style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(message)}</p>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Atsakykite į šį laišką ir atsakymas bus išsiųstas tiesiai ${escapeHtml(email)}.</p>
        </div>`,
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to send contact message", error);
    return { success: false, error: "SEND_FAILED" };
  }
}
