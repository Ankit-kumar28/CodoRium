import type {
  NextFunction,
  Response,
} from "express";

import type { AuthRequest } from "./auth.middleware.js";

import { prisma } from "../config/database.js";

export function requireRole(
  ...allowedRoles: Array<
    "ADMIN" |
    "STUDENT" |
    "PROBLEM_SETTER" |
    "FACULTY"
  >
) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const assignments =
        await prisma.userRoleAssignment.findMany({
          where: {
            userId: req.user.id,
            role: {
              in: allowedRoles,
            },
          },
        });

      if (assignments.length === 0) {
        return res.status(403).json({
          message: "You do not have permission",
        });
      }

      next();
    } catch {
      return res.status(500).json({
        message: "Authorization check failed",
      });
    }
  };
}