/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { userActions } from "@/app/actions/user";
import { emailActions } from "@/app/actions/email";
import CardHeader from "../components/CardHeader";
import CardWrapper from "../components/CardWrapper";

const ForgotPasswordPage = () => {
  const t = useTranslations("ForgotPasswordPage");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (emailError) {
      setEmailError("");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    let hasError = false;

    if (!email.trim()) {
      setEmailError(t("emailRequired"));
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError(t("invalidEmailFormat"));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await userActions.authentication.generateMagicLinkToken(
        email
      );
      if (token.error === "USER_NOT_FOUND") {
        setEmailError(t("userNotFound"));
        setIsLoading(false);
        return;
      }
      if (token.error === "OAUTH_USER") {
        setEmailError(t("oauthUserError"));
        setIsLoading(false);
        return;
      }
      if (token.success) {
        const htmlLang = document.documentElement.lang as string;
        const userLang =
          htmlLang === "lt" || htmlLang === "ru"
            ? (htmlLang as "lt" | "ru")
            : "lt";
        const passwordResetLink =
          await emailActions.authentication.sendPasswordResetEmail(
            email,
            token.token ?? "",
            userLang
          );
        if (passwordResetLink.success) {
          setIsSuccess(true);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setEmailError(t("resetLinkError"));
    } finally {
      setIsLoading(false);
    }
  };

  const emailInputClasses = `w-full h-12 lg:text-lg ${
    emailError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  return (
    <CardWrapper>
      <div className="flex flex-col">
        <CardHeader text={t("resetPassword")}></CardHeader>
        <div>
          <p className="text-lg mt-4 text-gray-700">
            {isSuccess ? t("resetLinkSent") : t("resetInstructions")}
          </p>
        </div>

        <form className="flex flex-col mt-6" onSubmit={handleSubmit}>
          {!isSuccess && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    className={emailInputClasses}
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <AlertCircle size={20} />
                    </div>
                  )}
                </div>
                {emailError && (
                  <p
                    id="email-error"
                    className="mt-1 text-base font-medium text-red-500"
                  >
                    {emailError}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type={isSuccess ? "button" : "submit"}
            className="w-full h-12 cursor-pointer bg-secondary rounded-lg text-lg text-gray-800 font-medium py-2 px-4 hover:bg-secondary-light transition flex items-center justify-center "
            disabled={isLoading}
            onClick={
              isSuccess ? () => (window.location.href = "/login") : undefined
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                {t("loading")}
              </>
            ) : isSuccess ? (
              t("backToLogin")
            ) : (
              t("sendResetLink")
            )}
          </button>

          {!isSuccess && (
            <div className="mt-2">
              <Link
                href="/login"
                className="text-violet-800 font-medium text-sm hover:underline"
              >
                {t("backToLogin")}
              </Link>
            </div>
          )}
        </form>
      </div>
    </CardWrapper>
  );
};

export default ForgotPasswordPage;
