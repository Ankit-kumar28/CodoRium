export type AuthRole =
  | "ADMIN"
  | "STUDENT"
  | "PROBLEM_SETTER"
  | "FACULTY";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  roles: AuthRole[];
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  requiresRoleSelection: boolean;
}