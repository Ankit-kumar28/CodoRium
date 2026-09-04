import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce
    .number()
    .default(3001),

  FRONTEND_URL:
    z.string().url(),

  DATABASE_URL:
    z.string().min(1),

  JWT_ACCESS_SECRET:
    z.string().min(32),

  JWT_REFRESH_SECRET:
    z.string().min(32),

  ACCESS_TOKEN_EXPIRES_IN:
    z.string().default("15m"),

  REFRESH_TOKEN_EXPIRES_IN_DAYS:
    z.coerce
      .number()
      .positive()
      .default(7),

  PASSWORD_RESET_EXPIRES_IN_MINUTES:
    z.coerce
      .number()
      .positive()
      .default(30),

  SMTP_HOST:
    z.string().min(1),

  SMTP_PORT:
    z.coerce
      .number()
      .positive()
      .default(587),

  SMTP_SECURE:
    z.string().transform(
      (value) => value === "true"
    ),

  SMTP_USER:
    z.string().email(),

  SMTP_PASSWORD:
    z.string().min(1),

  EMAIL_FROM_NAME:
    z.string().min(1),

  EMAIL_FROM_ADDRESS:
    z.string().email(),

  RESEND_API_KEY:
    z.string().optional(),

  RESEND_FROM_EMAIL:
    z.string().optional(),
});
const result =
  envSchema.safeParse(
    process.env
  );

if (!result.success) {
  console.error(
    "❌ Invalid environment variables"
  );

  console.error(
    result.error.flatten()
      .fieldErrors
  );

  process.exit(1);
}



export const env =
  result.data;