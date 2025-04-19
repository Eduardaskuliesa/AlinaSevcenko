import { checkEmail } from "./checkEmail";
import { generateMagicLinkToken } from "./generateMagicLink";
import { generateVerificationToken } from "./generateVerificationCode";
import { login } from "./login";
import { register } from "./register";
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
};
