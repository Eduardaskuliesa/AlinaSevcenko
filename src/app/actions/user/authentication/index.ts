import { changePassword } from "./changePassword";
import { checkEmail } from "./checkEmail";
import { registerUser, requestPasswordReset } from "./flows";
import { resetPassword } from "./resetPassword";
import { verifyToken } from "./verifyCode";
import { verifyMagicLinkToken } from "./verifyMagickLink";

export const authentication = {
  registerUser,
  requestPasswordReset,
  checkEmail,
  verifyToken,
  verifyMagicLinkToken,
  resetPassword,
  changePassword,
};
