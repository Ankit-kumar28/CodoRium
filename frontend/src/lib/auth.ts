import api from "./api";

import type { UserRole } from "@/types/auth";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  roles: UserRole[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
    requiresRoleSelection?: boolean;
  };
}

export interface MeResponse {
  message?: string;
  data?: User;
  user?: User;
}

/* =========================
   LOGIN
========================= */

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  if (typeof window !== "undefined") {
    const token = response.data.data?.accessToken;

    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }

  return response.data;
}

/* =========================
   LOGOUT
========================= */

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  }
}

/* =========================
   CURRENT USER
========================= */

export async function getMe() {
  const response = await api.get<MeResponse>(
    "/auth/me"
  );

  return response.data;
}

/* =========================
   REFRESH TOKEN
========================= */

export async function refreshToken() {
  const response = await api.post(
    "/auth/refresh"
  );

  const token =
    response.data?.data?.accessToken ||
    response.data?.accessToken;

  if (
    token &&
    typeof window !== "undefined"
  ) {
    localStorage.setItem(
      "accessToken",
      token
    );
  }

  return response.data;
}

/* =========================
   FORGOT PASSWORD
========================= */

export async function forgotPassword(
  email: string
) {
  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
}

/* =========================
   RESET PASSWORD
========================= */

export async function resetPassword(
  token: string,
  newPassword: string
) {
  const response = await api.post(
    "/auth/reset-password",
    {
      token,
      newPassword,
    }
  );

  return response.data;
}

/* =========================
   CHANGE PASSWORD
========================= */

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const response = await api.post(
    "/auth/change-password",
    {
      currentPassword,
      newPassword,
    }
  );

  return response.data;
}