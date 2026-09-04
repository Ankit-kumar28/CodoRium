import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

export interface AuthRequest
  extends Request {
  user?: {
    id: string;
    sessionId: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization header",
      });
    }

    const payload =
      verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      sessionId:
        payload.sessionId,
    };

    next();
  } catch {
    return res.status(401).json({
      message:
        "Invalid or expired access token",
    });
  }
}