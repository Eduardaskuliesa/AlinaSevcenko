"use server";
import { logger } from "@/app/utils/logger";
import { checkEmail } from "./checkEmail";
import { register, RegisterFormData } from "./register";
import { generateVerificationToken } from "./generateVerificationCode";
import { generateMagicLinkToken } from "./generateMagicLink";
import { createPreferences } from "../preferences/createPreferences";
import { sendVerificationEmail } from "../../email/authentication/sendVerificationEmail";
import { sendPasswordResetEmail } from "../../email/authentication/sendPasswordResetLink";

type Lang = "lt" | "ru";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toLang = (lang: string): Lang => (lang === "ru" ? "ru" : "lt");

function isValidPassword(password: string) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password)
  );
}

export async function registerUser(formData: RegisterFormData, lang: string) {
  const email = formData?.email?.trim();
  const fullName = formData?.fullName?.trim();

  if (
    !email ||
    !EMAIL_REGEX.test(email) ||
    !fullName ||
    !isValidPassword(formData.password)
  ) {
    return { success: false, error: "INVALID_INPUT" };
  }

  const emailCheck = await checkEmail(email);
  if (!emailCheck.success) {
    return {
      success: false,
      error: emailCheck.error ?? "REGISTRATION_FAILED",
    };
  }

  const result = await register({ email, fullName, password: formData.password });
  if (!result.success || !result.userId) {
    return { success: false, error: "REGISTRATION_FAILED" };
  }

  const userLang = toLang(lang);
  await createPreferences(result.userId, userLang);

  const verification = await generateVerificationToken(result.userId);
  if (!verification.success || !verification.token) {
    logger.error(`Could not create verification token for ${result.userId}`);
    return { success: false, error: "REGISTRATION_FAILED" };
  }

  const sent = await sendVerificationEmail(email, verification.token, userLang);
  return sent.success
    ? { success: true }
    : { success: false, error: "EMAIL_FAILED" };
}

export async function requestPasswordReset(email: string, lang: string) {
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return { success: false, error: "INVALID_EMAIL" };
  }

  const normalizedEmail = email.trim();
  const token = await generateMagicLinkToken(normalizedEmail);
  if (!token.success || !token.token) {
    return { success: false, error: token.error ?? "INTERNAL_ERROR" };
  }

  const sent = await sendPasswordResetEmail(
    normalizedEmail,
    token.token,
    toLang(lang)
  );
  return sent.success
    ? { success: true }
    : { success: false, error: "EMAIL_FAILED" };
}
