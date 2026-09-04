import type {
  Response,
} from "express";

import type {
  AuthRequest,
} from "../../middleware/auth.middleware.js";

import {
  generateCredentials,
} from "./admin.service.js";

import {
  generateCredentialsSchema,
} from "./admin.validation.js";

export async function generateCredentialsController(
  req: AuthRequest,
  res: Response
) {
  const result =
    generateCredentialsSchema.safeParse(
      req.body
    );

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors:
        result.error.flatten().fieldErrors,
    });
  }

  try {
    const data =
      await generateCredentials(result.data);

    return res.status(201).json({
      message:
        "Credentials generated successfully",
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate credentials";

    if (
      message.includes(
        "already exists"
      )
    ) {
      return res.status(409).json({
        message,
      });
    }

    return res.status(500).json({
      message:
        "Failed to generate credentials",
    });
  }
}