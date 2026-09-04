import api from "./api";
import type {
  User,
  LoginResponse,
  GenerateCredentialsPayload,
  GenerateCredentialsResponse,
} from "@/types/auth";

/* =========================
   LOGIN
========================= */

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
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

export async function getMe(): Promise<User> {
  const response = await api.get("/auth/me");

  // Backend returns { data: { id, email, firstName, lastName, roles[] } }
  const userData = response.data?.data;

  if (!userData) {
    throw new Error("User not found");
  }

  return userData as User;
}

/* =========================
   REFRESH TOKEN
========================= */

export async function refreshToken() {
  const response = await api.post("/auth/refresh");

  const token =
    response.data?.data?.accessToken ||
    response.data?.accessToken;

  if (token && typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }

  return response.data;
}

/* =========================
   FORGOT PASSWORD
========================= */

export async function forgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

/* =========================
   RESET PASSWORD
========================= */

export async function resetPassword(
  token: string,
  newPassword: string
) {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
}

/* =========================
   CHANGE PASSWORD
========================= */

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const response = await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
}

/* =========================
   ADMIN: GENERATE CREDENTIALS
========================= */

export async function generateCredentials(
  payload: GenerateCredentialsPayload
): Promise<GenerateCredentialsResponse> {
  const response = await api.post<{
    message: string;
    data: GenerateCredentialsResponse;
  }>("/admin/credentials", payload);

  return response.data.data;
}

export type { User };