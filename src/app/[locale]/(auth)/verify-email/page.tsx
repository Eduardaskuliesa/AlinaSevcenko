"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { userActions } from "@/app/actions/user";
import CardWrapper from "../components/CardWrapper";

type VerificationStatus =
  | { type: "loading" }
  | { type: "success" }
  | {
      type: "error";
      errorType:
        | "INVALID_VERIFICATION_LINK"
        | "VERIFICATION_LINK_EXPIRED"
        | "ALREADY_VERIFIED"
        | "UNKNOWN_ERROR";
    };

const VerifyEmailPage = () => {
  const t = useTranslations("VerifyEmailPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>({
    type: "loading",
  });

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        errorType: "INVALID_VERIFICATION_LINK",
      });
      setMessage(t("invalidToken"));
      return;
    }

    const verifyToken = async () => {
      try {
        const result = await userActions.authentication.verifyToken(token);

        if (result.success) {
          setStatus({ type: "success" });
          setTimeout(() => {
            router.push("/login");
          }, 500);
        } else {
          switch (result.error) {
            case "ALREADY_VERIFIED":
              setStatus({
                type: "error",
                errorType: "ALREADY_VERIFIED",
              });
              setMessage(result.message || t("alreadyVerified"));
              break;
            case "VERIFICATION_LINK_EXPIRED":
              setStatus({
                type: "error",
                errorType: "VERIFICATION_LINK_EXPIRED",
              });
              setMessage(t("expiredLink"));
              break;
            default:
              setStatus({
                type: "error",
                errorType: "UNKNOWN_ERROR",
              });
              setMessage(result.message || t("defaultError"));
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
  }, [token, router, t]);

  return (
    <CardWrapper>
      <div className="flex flex-col items-center text-center">
        <h1 className="header text-4xl mb-6">{t("title")}</h1>

        {status.type === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={64} className="text-secondary animate-spin mb-4" />
            <p className="text-lg">{t("verifyingEmail")}</p>
          </div>
        )}

        {status.type === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <p className="text-lg">{t("verificationSuccess")}</p>
          </div>
        )}

        {status.type === "error" && (
          <div className="flex flex-col items-center">
            {status.errorType === "ALREADY_VERIFIED" ? (
              <>
                <AlertTriangle size={64} className="text-yellow-500 mb-4" />
                <p className="text-lg font-medium text-yellow-600 mb-2">
                  {t("alreadyVerifiedTitle")}
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-secondary hover:bg-secondary-light text-gray-800 font-medium py-2 px-6 rounded-lg transition"
                >
                  {t("goToLogin")}
                </button>
              </>
            ) : (
              <>
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <p className="text-lg font-medium text-red-600 mb-2">
                  {status.errorType === "INVALID_VERIFICATION_LINK" &&
                    t("invalidLinkTitle")}
                  {status.errorType === "VERIFICATION_LINK_EXPIRED" &&
                    t("expiredLinkTitle")}
                  {status.errorType === "UNKNOWN_ERROR" && t("errorTitle")}
                </p>
                <p className="text-base mb-4">{message}</p>
                <button
                  onClick={() => router.push("/register")}
                  className="bg-secondary hover:bg-secondary-light text-gray-800 font-medium py-2 px-6 rounded-lg transition"
                >
                  {t("backToRegister")}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailPage;
