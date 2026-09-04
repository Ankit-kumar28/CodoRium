import nodemailer from "nodemailer";

import { env } from "../../config/env.js";

import {
  passwordResetEmailTemplate,
} from "./email.templates.js";

import type {
  SendPasswordResetEmailInput,
} from "./email.types.js";

const transporter =
  nodemailer.createTransport({
    host: env.SMTP_HOST,

    port: env.SMTP_PORT,

    secure: env.SMTP_SECURE,

    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

export async function verifyEmailConnection() {
  await transporter.verify();

  console.log(
    "✅ Email SMTP connection verified"
  );
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetEmailInput
) {
  const resetUrl =
    `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(
      input.resetToken
    )}`;

  const template =
    passwordResetEmailTemplate({
      firstName: input.firstName,
      resetUrl,
    });

  await transporter.sendMail({
    from: {
      name: env.EMAIL_FROM_NAME,
      address:
        env.EMAIL_FROM_ADDRESS,
    },

    to: input.to,

    subject:
      template.subject,

    html:
      template.html,
  });

  console.log(
    `📧 Password reset email sent to ${input.to}`
  );
}