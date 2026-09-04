import { Router } from "express";

import {
  generateCredentialsController,
} from "./admin.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  requireRole,
} from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/credentials",
  authenticate,
  requireRole("ADMIN"),
  generateCredentialsController
);

export default router;