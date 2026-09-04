import type {
  Request,
  Response,
} from "express";

import {
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from "./auth.service.js";

import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.validation.js";

import {
  AUTH_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_PATH,
} from "./auth.constants.js";

import type {
  AuthRequest,
} from "../../middleware/auth.middleware.js";

function setRefreshTokenCookie(
  res: Response,
  refreshToken: string
) {
  res.cookie(
    AUTH_COOKIE_NAME,
    refreshToken,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict",

      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,

      path:
        REFRESH_TOKEN_COOKIE_PATH,
    }
  );
}

function clearRefreshTokenCookie(
  res: Response
) {
  res.clearCookie(
    AUTH_COOKIE_NAME,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict",

      path:
        REFRESH_TOKEN_COOKIE_PATH,
    }
  );
}

/**
 * LOGIN
 */
export async function loginController(
  req: Request,
  res: Response
) {
  const result =
    loginSchema.safeParse(
      req.body
    );

  if (!result.success) {
    return res.status(400).json({
      message:
        "Validation failed",
      errors:
        result.error.flatten()
          .fieldErrors,
    });
  }

  try {
    const data =
      await login(result.data);

    setRefreshTokenCookie(
      res,
      data.refreshToken
    );

    return res.status(200).json({
      message:
        "Login successful",

      data: {
        user: data.user,

        accessToken:
          data.accessToken,

        requiresRoleSelection:
          data.requiresRoleSelection,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
}

/**
 * REFRESH
 */
export async function refreshController(
  req: Request,
  res: Response
) {
  const refreshToken =
    req.cookies?.[
      AUTH_COOKIE_NAME
    ];

  if (!refreshToken) {
    return res.status(401).json({
      message:
        "Refresh token missing",
    });
  }

  try {
    const data =
      await refreshAccessToken(
        refreshToken
      );

    return res.status(200).json({
      message:
        "Token refreshed",

      data,
    });
  } catch {
    clearRefreshTokenCookie(res);

    return res.status(401).json({
      message:
        "Invalid or expired refresh token",
    });
  }
}

/**
 * LOGOUT
 */
export async function logoutController(
  req: Request,
  res: Response
) {
  const refreshToken =
    req.cookies?.[
      AUTH_COOKIE_NAME
    ];

  if (refreshToken) {
    await logout(
      refreshToken
    );
  }

  clearRefreshTokenCookie(res);

  return res.status(200).json({
    message:
      "Logged out successfully",
  });
}

/**
 * CURRENT USER
 */
export async function meController(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required",
    });
  }

  try {
    const user =
      await getCurrentUser(
        req.user.id
      );

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "User not found",
    });
  }
}

/**
 * CHANGE PASSWORD
 */
export async function changePasswordController(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required",
    });
  }

  const result =
    changePasswordSchema.safeParse(
      req.body
    );

  if (!result.success) {
    return res.status(400).json({
      message:
        "Validation failed",
      errors:
        result.error.flatten()
          .fieldErrors,
    });
  }

  try {
    await changePassword(
      req.user.id,
      result.data.currentPassword,
      result.data.newPassword
    );

    return res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Password change failed",
    });
  }
}

/**
 * FORGOT PASSWORD
 */
export async function forgotPasswordController(
  req: Request,
  res: Response
) {
  const result =
    forgotPasswordSchema.safeParse(
      req.body
    );

  if (!result.success) {
    return res.status(400).json({
      message:
        "Validation failed",
      errors:
        result.error.flatten()
          .fieldErrors,
    });
  }

  await forgotPassword(
    result.data.email
  );

  /*
   * Always same response.
   */
  return res.status(200).json({
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
}

/**
 * RESET PASSWORD
 */
export async function resetPasswordController(
  req: Request,
  res: Response
) {
  const result =
    resetPasswordSchema.safeParse(
      req.body
    );

  if (!result.success) {
    return res.status(400).json({
      message:
        "Validation failed",
      errors:
        result.error.flatten()
          .fieldErrors,
    });
  }

  try {
    await resetPassword(
      result.data.token,
      result.data.newPassword
    );

    return res.status(200).json({
      message:
        "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Password reset failed",
    });
  }
}