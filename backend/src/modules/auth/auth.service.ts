import crypto from "node:crypto";

import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";


import {
  hashPassword,
  verifyPassword,
} from "../../utils/password.js";

import {
  createAccessToken,
} from "../../utils/jwt.js";

import type {
  AuthRole,
  AuthUser,
  LoginResult,
} from "./auth.types.js";

import type {
  LoginInput,
} from "./auth.validation.js";


import {
  sendPasswordResetEmail,
} from "../../services/email/email.service.js";



function generateRandomToken(
  bytes = 48
): string {
  return crypto
    .randomBytes(bytes)
    .toString("hex");
}

function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function mapUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  roles: Array<{
    role: AuthRole;
  }>;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles.map(
      (assignment) => assignment.role
    ),
  };
}

/**
 * LOGIN
 */
export async function login(
  input: LoginInput
): Promise<LoginResult> {
  const email =
    input.email.toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new Error(
      "Your account is inactive"
    );
  }

  const passwordValid =
    await verifyPassword(
      user.passwordHash,
      input.password
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const refreshToken =
    generateRandomToken();

  const refreshTokenHash =
    hashToken(refreshToken);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() +
      env.REFRESH_TOKEN_EXPIRES_IN_DAYS
  );

  const session =
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt,
      },
    });

  const accessToken =
    createAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

  const authUser =
    mapUser(user);

  return {
    user: authUser,

    accessToken,

    refreshToken,

    requiresRoleSelection:
      authUser.roles.length > 1,
  };
}

/**
 * REFRESH ACCESS TOKEN
 */
export async function refreshAccessToken(
  refreshToken: string
) {
  const refreshTokenHash =
    hashToken(refreshToken);

  const session =
    await prisma.session.findUnique({
      where: {
        refreshTokenHash,
      },
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
    });

  if (!session) {
    throw new Error(
      "Invalid refresh token"
    );
  }

  if (session.revokedAt) {
    throw new Error(
      "Session has been revoked"
    );
  }

  if (
    session.expiresAt < new Date()
  ) {
    throw new Error(
      "Refresh token expired"
    );
  }

  if (
    session.user.status !== "ACTIVE"
  ) {
    throw new Error(
      "Your account is inactive"
    );
  }

  const accessToken =
    createAccessToken({
      userId: session.user.id,
      sessionId: session.id,
    });

  return {
    accessToken,
  };
}

/**
 * LOGOUT
 */
export async function logout(
  refreshToken: string
): Promise<void> {
  const refreshTokenHash =
    hashToken(refreshToken);

  await prisma.session.updateMany({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

/**
 * CURRENT USER
 */
export async function getCurrentUser(
  userId: string
): Promise<AuthUser> {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: true,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new Error(
      "Your account is inactive"
    );
  }

  return mapUser(user);
}

/**
 * CHANGE PASSWORD
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const passwordValid =
    await verifyPassword(
      user.passwordHash,
      currentPassword
    );

  if (!passwordValid) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  const newPasswordHash =
    await hashPassword(
      newPassword
    );

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash:
          newPasswordHash,
      },
    }),

    prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
}

/**
 * FORGOT PASSWORD
 */
export async function forgotPassword(
  email: string
): Promise<void> {
  const normalizedEmail =
    email.toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

  /*
   * Do not reveal whether
   * the email exists.
   */
  if (!user) {
    return;
  }

  if (user.status !== "ACTIVE") {
    return;
  }

  const rawToken =
    generateRandomToken();

  const tokenHash =
    hashToken(rawToken);

  const expiresAt =
    new Date(
      Date.now() +
        env.PASSWORD_RESET_EXPIRES_IN_MINUTES *
          60 *
          1000
    );

  await prisma.passwordResetToken.deleteMany(
    {
      where: {
        userId: user.id,
        usedAt: null,
      },
    }
  );

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  /*
   * DEVELOPMENT ONLY
   *
   * Later this will be sent through
   * the college email service.
   */
//   console.log(
//     "===================================="
//   );

//   console.log(
//     `PASSWORD RESET TOKEN FOR ${user.email}`
//   );

//   console.log(rawToken);

//   console.log(
//     "===================================="
//   );

await sendPasswordResetEmail({
  to: user.email,
  firstName: user.firstName,
  resetToken: rawToken,
});

}

/**
 * RESET PASSWORD
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const tokenHash =
    hashToken(token);

  const resetToken =
    await prisma.passwordResetToken.findUnique(
      {
        where: {
          tokenHash,
        },
      }
    );

  if (!resetToken) {
    throw new Error(
      "Invalid or expired reset token"
    );
  }

  if (resetToken.usedAt) {
    throw new Error(
      "Reset token has already been used"
    );
  }

  if (
    resetToken.expiresAt < new Date()
  ) {
    throw new Error(
      "Reset token has expired"
    );
  }

  const passwordHash =
    await hashPassword(
      newPassword
    );

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        passwordHash,
      },
    }),

    prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        usedAt: new Date(),
      },
    }),

    prisma.session.updateMany({
      where: {
        userId: resetToken.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
}