export interface SendPasswordResetEmailInput {
  to: string;
  firstName: string;
  resetToken: string;
}