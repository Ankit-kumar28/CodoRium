export type UserRole =
  | "ADMIN"
  | "STUDENT"
  | "PROBLEM_SETTER"
  | "FACULTY";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  roles: UserRole[];
}

export interface LoginResponse {
  message: string;

  data: {
    user: User;
    accessToken: string;
    requiresRoleSelection: boolean;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/* =========================
   ADMIN TYPES
========================= */

export type AdminAssignableRole =
  | "STUDENT"
  | "PROBLEM_SETTER"
  | "FACULTY";

export interface GenerateCredentialsPayload {
  firstName: string;
  lastName?: string;
  email: string;
  roles: AdminAssignableRole[];
}

export interface GeneratedUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  roles: AdminAssignableRole[];
}

export interface GenerateCredentialsResponse {
  user: GeneratedUser;
  temporaryPassword: string;
}