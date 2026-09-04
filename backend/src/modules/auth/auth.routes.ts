import { Router } from "express";

import {
  loginController,
  refreshController,
  logoutController,
  meController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/login",
  loginController
);

router.post(
  "/refresh",
  refreshController
);

router.post(
  "/logout",
  logoutController
);

router.get(
  "/me",
  authenticate,
  meController
);

router.post(
  "/change-password",
  authenticate,
  changePasswordController
);

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);

export default router;