import { z } from "zod";

export const generateCredentialsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name is too long")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  roles: z
    .array(
      z.enum([
        "STUDENT",
        "PROBLEM_SETTER",
        "FACULTY",
      ])
    )
    .min(1, "At least one role is required")
    .max(3, "Maximum three roles are allowed"),
});

export type GenerateCredentialsInput =
  z.infer<typeof generateCredentialsSchema>;