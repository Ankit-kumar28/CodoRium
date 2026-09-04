import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AccessTokenPayload {
  userId: string;
  sessionId: string;
}

export function createAccessToken(
  payload: AccessTokenPayload
): string {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        env.ACCESS_TOKEN_EXPIRES_IN,
    } as SignOptions
  );
}

export function verifyAccessToken(
  token: string
): AccessTokenPayload {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as AccessTokenPayload;
}