import { sendPasswordResetEmail } from "./sendPasswordResetLink";
import { sendVerificationEmail } from "./sendVerificationEmail";

export const authentication = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
