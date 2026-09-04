import crypto from "node:crypto";

import { prisma } from "../../config/database.js";
import { hashPassword } from "../../utils/password.js";

import type {
  GenerateCredentialsInput,
} from "./admin.validation.js";

function generateTemporaryPassword(): string {
  return crypto.randomBytes(9).toString("base64url");
}

export async function generateCredentials(
  input: GenerateCredentialsInput
) {
  const email = input.email.toLowerCase();

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists"
    );
  }

  const temporaryPassword =
    generateTemporaryPassword();

  const passwordHash =
    await hashPassword(temporaryPassword);

  const user = await prisma.$transaction(
    async (tx) => {
      const createdUser =
        await tx.user.create({
          data: {
            firstName: input.firstName,
            lastName:
              input.lastName?.trim() || null,
            email,
            passwordHash,
            status: "ACTIVE",
          },
        });

      await tx.userRoleAssignment.createMany({
        data: input.roles.map((role) => ({
          userId: createdUser.id,
          role,
        })),
      });

      return tx.user.findUniqueOrThrow({
        where: {
          id: createdUser.id,
        },
        include: {
          roles: true,
        },
      });
    }
  );

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles.map(
        (assignment) => assignment.role
      ),
    },

    temporaryPassword,
  };
}