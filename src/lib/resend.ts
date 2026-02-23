import { Resend } from "resend";

// Lazy-initialize so build-time doesn't fail without env vars
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Our Daily Bread <onboarding@resend.dev>";
export const ADMIN_EMAIL =
  process.env.RESEND_ADMIN_EMAIL || "admin@ourdailybread.club";
