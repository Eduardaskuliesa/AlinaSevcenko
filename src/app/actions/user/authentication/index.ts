import { changePassword } from "./changePassword";
import { checkEmail } from "./checkEmail";
import { generateMagicLinkToken } from "./generateMagicLink";
import { generateVerificationToken } from "./generateVerificationCode";
import { login } from "./login";
import { register } from "./register";
import { resetPassword } from "./resetPassword";
import { verifyToken } from "./verifyCode";
import { verifyMagicLinkToken } from "./verifyMagickLink";

export const authentication = {
  register,
  checkEmail,
  login,
  generateVerificationToken,
  verifyToken,
  generateMagicLinkToken,
  verifyMagicLinkToken,
  resetPassword,
  changePassword,
};
