"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { userActions } from "@/app/actions/user";
import CardWrapper from "../components/CardWrapper";

type ResetStatus =
  | { type: "loading" }
  | { type: "validToken" }
  | { type: "success" }
  | {
      type: "error";
      errorType:
        | "INVALID_RESET_LINK"
        | "RESET_LINK_EXPIRED"
        | "RESET_LINK_USED"
        | "UNKNOWN_ERROR";
    };

const PasswordResetPage = () => {
  const t = useTranslations("PasswordResetPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<ResetStatus>({
    type: "loading",
  });
  const [message, setMessage] = useState<string>("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        errorType: "INVALID_RESET_LINK",
      });
      setMessage(t("invalidToken"));
      return;
    }

    const verifyToken = async () => {
      try {
        const result = await userActions.authentication.verifyMagicLinkToken(
          token
        );

        if (result.success) {
          setStatus({ type: "validToken" });
        } else {
          switch (result.error) {
            case "MAGIC_LINK_USED":
              setStatus({
                type: "error",
                errorType: "RESET_LINK_USED",
              });
              setMessage(t("usedLink"));
              break;
            case "MAGIC_LINK_EXPIRED":
              setStatus({
                type: "error",
                errorType: "RESET_LINK_EXPIRED",
              });
              setMessage(t("expiredLink"));
              break;
            default:
              setStatus({
                type: "error",
                errorType: "UNKNOWN_ERROR",
              });
              setMessage(t("defaultError"));
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setStatus({
          type: "error",
          errorType: "UNKNOWN_ERROR",
        });
        setMessage(t("defaultError"));
      }
    };

    verifyToken();
  }, [token, t]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordError("");

    if (!password.trim()) {
      setPasswordError(t("passwordRequired"));
      return;
    }

    if (password.length < 8) {
      setPasswordError(t("passwordTooShort"));
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError(t("passwordNeedsCapital"));
      return;
    }

    setIsLoading(true);

    try {
      const result = await userActions.authentication.resetPassword(
        token!,
        password
      );

      if (result.success) {
        setStatus({ type: "success" });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setPasswordError(result.message || t("resetError"));
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setPasswordError(t("resetError"));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordInputClasses = `w-full h-12 pr-10 lg:text-lg ${
    passwordError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  return (
    <CardWrapper>
      <div className="flex flex-col">
        <h1 className="header text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {t("resetPassword")}
        </h1>

        {status.type === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={64} className="text-secondary animate-spin mb-4" />
            <p className="text-lg">{t("verifyingLink")}</p>
          </div>
        )}

        {status.type === "validToken" && (
          <div className="w-full">
            <p className="text-lg mb-6">{t("createNewPassword")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="w-full mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={passwordInputClasses}
                    placeholder={t("newPasswordPlaceholder")}
                    value={password}
                    onChange={handlePasswordChange}
                    aria-invalid={!!passwordError}
                    aria-describedby={
                      passwordError ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id="password-error"
                    className="mt-1 text-base font-medium text-red-500"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-12 cursor-pointer bg-secondary rounded-lg text-lg text-gray-800 font-medium py-2 px-4 hover:bg-secondary-light transition flex items-center justify-center mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    {t("loading")}
                  </>
                ) : (
                  t("setNewPassword")
                )}
              </button>
            </form>
          </div>
        )}

        {status.type === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <p className="text-lg mb-6">{t("passwordResetSuccess")}</p>
            <p className="text-sm text-gray-500">{t("redirectingToLogin")}</p>
          </div>
        )}

        {status.type === "error" && (
          <div className="flex flex-col items-center">
            <AlertCircle size={64} className="text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-600 mb-2">
              {status.errorType === "INVALID_RESET_LINK" &&
                t("invalidLinkTitle")}
              {status.errorType === "RESET_LINK_EXPIRED" &&
                t("expiredLinkTitle")}
              {status.errorType === "RESET_LINK_USED" && t("usedLinkTitle")}
              {status.errorType === "UNKNOWN_ERROR" && t("errorTitle")}
            </p>
            <p className="text-base mb-4">{message}</p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="bg-secondary hover:bg-secondary-light text-gray-800 font-medium py-2 px-6 rounded-lg transition"
            >
              {t("requestNewLink")}
            </button>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default PasswordResetPage;
