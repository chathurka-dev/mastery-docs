import { Resend } from "resend";
import { env } from "@/lib/env";

const APP_NAME = "MasteryDocs";
const DEFAULT_DEV_FROM_EMAIL = "onboarding@resend.dev";

let resend: Resend | null = null;

function getResend() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send email.");
  }

  resend ??= new Resend(env.RESEND_API_KEY);
  return resend;
}

function getFromEmail() {
  const from = env.RESEND_FROM_EMAIL ?? (
    env.NODE_ENV === "production" ? undefined : DEFAULT_DEV_FROM_EMAIL
  );

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is required in production.");
  }

  return from;
}

export async function sendVerificationEmail(email: string, url: string) {
  const deliveryIssue = getEmailDeliveryIssue(email);
  if (deliveryIssue) throw new Error(deliveryIssue);

  await getResend().emails.send({
    from: getFromEmail(),
    to: email,
    subject: `Verify your ${APP_NAME} email`,
    html: buildEmailHtml({
      heading: "Confirm your email address",
      body: "Click the button below to verify your email and activate your account.",
      ctaText: "Verify Email",
      ctaUrl: url,
    }),
    text: buildEmailText({
      heading: "Confirm your email address",
      body: "Click the link below to verify your email and activate your account.",
      ctaUrl: url,
    }),
  });
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const deliveryIssue = getEmailDeliveryIssue(email);
  if (deliveryIssue) throw new Error(deliveryIssue);

  await getResend().emails.send({
    from: getFromEmail(),
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: buildEmailHtml({
      heading: "Reset your password",
      body: "Click the button below to reset your password. This link expires in 1 hour.",
      ctaText: "Reset Password",
      ctaUrl: url,
    }),
    text: buildEmailText({
      heading: "Reset your password",
      body: "Use the link below to reset your password. This link expires in 1 hour.",
      ctaUrl: url,
    }),
  });
}

export function getEmailDeliveryIssue(email: string) {
  const from = getFromEmail();

  if (from !== DEFAULT_DEV_FROM_EMAIL) return null;

  if (!env.RESEND_TEST_RECIPIENT_EMAIL) return null;

  const canReceiveTestEmail =
    email.trim().toLowerCase() === env.RESEND_TEST_RECIPIENT_EMAIL.toLowerCase();

  if (canReceiveTestEmail) return null;

  return `Resend is using its testing sender (${DEFAULT_DEV_FROM_EMAIL}), which only delivers to ${env.RESEND_TEST_RECIPIENT_EMAIL}. Verify a domain in Resend and set RESEND_FROM_EMAIL to an address on that domain before sending to ${email}.`;
}

function buildEmailHtml({
  heading,
  body,
  ctaText,
  ctaUrl,
}: {
  heading: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}) {
  const safeHeading = escapeHtml(heading);
  const safeBody = escapeHtml(body);
  const safeCtaText = escapeHtml(ctaText);
  const safeCtaUrl = escapeHtml(ctaUrl);

  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td bgcolor="#7c3aed" style="background-color:#7c3aed;padding:32px;text-align:center;">
                    <span style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-1px;">${APP_NAME}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 48px;">
                    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0f172a;">${safeHeading}</h1>
                    <p style="margin:0 0 32px;font-size:16px;color:#475569;line-height:1.6;">${safeBody}</p>
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td bgcolor="#7c3aed" style="background-color:#7c3aed;border-radius:10px;">
                          <a href="${safeCtaUrl}" style="display:inline-block;color:#ffffff;text-decoration:none;padding:14px 32px;font-weight:700;font-size:15px;line-height:20px;">${safeCtaText}</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">
                      If the button is not visible, copy and paste this link into your browser:<br>
                      <a href="${safeCtaUrl}" style="color:#6d28d9;text-decoration:underline;word-break:break-all;">${safeCtaUrl}</a>
                    </p>
                    <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;">If you didn't request this, you can safely ignore this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 48px;border-top:1px solid #f1f5f9;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buildEmailText({
  heading,
  body,
  ctaUrl,
}: {
  heading: string;
  body: string;
  ctaUrl: string;
}) {
  return `${APP_NAME}\n\n${heading}\n\n${body}\n\n${ctaUrl}\n\nIf you didn't request this, you can safely ignore this email.`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
