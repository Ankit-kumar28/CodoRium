export interface SendPasswordResetEmailInput {
  to: string;
  firstName: string;
  resetToken: string;
}

export interface SendCredentialsEmailInput {
  to: string;
  firstName: string;
  temporaryPassword: string;
  roles: string[];
}