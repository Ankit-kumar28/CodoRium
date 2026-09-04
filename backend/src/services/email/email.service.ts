import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../../config/env.js";
import {
  passwordResetEmailTemplate,
  credentialsEmailTemplate,
} from "./email.templates.js";
import type {
  SendPasswordResetEmailInput,
  SendCredentialsEmailInput,
} from "./email.types.js";

// Initialize Resend client if API key is present
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Fallback Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function verifyEmailConnection() {
  if (resend) {
    console.log("✅ Resend API client active — email delivery configured via HTTP API");
    return;
  }

  try {
    await transporter.verify();
    console.log("✅ Email SMTP connection verified");
  } catch (error) {
    console.warn(
      "⚠️ SMTP verification failed/skipped (Outbound Port 587 may be blocked by cloud host):",
      error instanceof Error ? error.message : error
    );
  }
}

/**
  Send email via Resend Official SDK (HTTP REST API)
  Prevents SMTP port 587/465 blocks on Render, Vercel, and cloud servers.
 */
async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  if (!resend || !env.RESEND_API_KEY) return false;

  try {
    // If using custom sender, e.g. "CodoRium <noreply@yourdomain.com>"
    // Otherwise fallback to Resend testing domain "onboarding@resend.dev"
    const fromStr =
      env.RESEND_FROM_EMAIL ||
      `${env.EMAIL_FROM_NAME || "CodoRium"} <onboarding@resend.dev>`;

    const { data, error } = await resend.emails.send({
      from: fromStr,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend SDK delivery error:", error);
      return false;
    }

    console.log(`📧 Email delivered via Resend API to ${to} (ID: ${data?.id})`);
    return true;
  } catch (error) {
    console.error("❌ Resend SDK send failed:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(
    input.resetToken
  )}`;

  const template = passwordResetEmailTemplate({
    firstName: input.firstName,
    resetUrl,
  });

  // Always print reset link to console for easy testing / debugging
  console.log(`\n========================================`);
  console.log(`🔑 PASSWORD RESET LINK for ${input.to}:`);
  console.log(`${resetUrl}`);
  console.log(`========================================\n`);

  // Try Resend HTTP API first (Render/Vercel compatible)
  const sentViaResend = await sendViaResend(input.to, template.subject, template.html);
  if (sentViaResend) return;

  // Fallback to Nodemailer SMTP
  try {
    await transporter.sendMail({
      from: {
        name: env.EMAIL_FROM_NAME,
        address: env.EMAIL_FROM_ADDRESS,
      },
      to: input.to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`📧 Password reset email sent via SMTP to ${input.to}`);
  } catch (error) {
    console.error(`❌ SMTP delivery failed for ${input.to}:`, error instanceof Error ? error.message : error);
  }
}

export async function sendCredentialsEmail(input: SendCredentialsEmailInput) {
  const template = credentialsEmailTemplate({
    firstName: input.firstName,
    temporaryPassword: input.temporaryPassword,
    roles: input.roles,
  });

  const htmlContent = template.html.replace("EMAIL_PLACEHOLDER", input.to);

  // Always print temporary credentials to console for easy testing / debugging
  console.log(`\n========================================`);
  console.log(`👤 NEW USER CREDENTIALS FOR ${input.to}:`);
  console.log(`Email: ${input.to}`);
  console.log(`Temporary Password: ${input.temporaryPassword}`);
  console.log(`Roles: ${input.roles.join(", ")}`);
  console.log(`========================================\n`);

  // Try Resend HTTP API first (Render/Vercel compatible)
  const sentViaResend = await sendViaResend(input.to, template.subject, htmlContent);
  if (sentViaResend) return;

  // Fallback to Nodemailer SMTP
  try {
    await transporter.sendMail({
      from: {
        name: env.EMAIL_FROM_NAME,
        address: env.EMAIL_FROM_ADDRESS,
      },
      to: input.to,
      subject: template.subject,
      html: htmlContent,
    });
    console.log(`📧 Credentials email sent via SMTP to ${input.to}`);
  } catch (error) {
    console.error(`❌ SMTP delivery failed for ${input.to}:`, error instanceof Error ? error.message : error);
  }
}