export type AdminRole =
  | "STUDENT"
  | "PROBLEM_SETTER"
  | "FACULTY";

export interface GenerateCredentialsInput {
  firstName: string;
  lastName?: string;
  email: string;
  roles: AdminRole[];
}

export interface GeneratedCredentialUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  roles: AdminRole[];
}

export interface GeneratedCredentialsResponse {
  user: GeneratedCredentialUser;
  temporaryPassword: string;
}