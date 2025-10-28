import { changePassword } from "./changePassword";
import { checkEmail } from "./checkEmail";
import { generateMagicLinkToken } from "./generateMagicLink";
import { generateVerificationToken } from "./generateVerificationCode";
import { getUser } from "./getUser";
import { getUserByEmail } from "./getUserByEmail";
import { login } from "./login";
import { register } from "./register";
import { registerOAuth } from "./registerOAuth";
import { resetPassword } from "./resetPassword";
import { verifyToken } from "./verifyCode";
import { verifyMagicLinkToken } from "./verifyMagickLink";

export const authentication = {
  register,
  registerOAuth,
  getUser,
  checkEmail,
  login,
  getUserByEmail,
  generateVerificationToken,
  verifyToken,
  generateMagicLinkToken,
  verifyMagicLinkToken,
  resetPassword,
  changePassword,
};
