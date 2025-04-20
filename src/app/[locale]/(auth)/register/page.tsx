"use client";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import CardWrapper from "../components/CardWrapper";

const Page = () => {
  const t = useTranslations("RegisterPage");
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const email = searchParams.get("email");

  return (
    <CardWrapper>
      <div className="flex flex-col">
        {status === "pending" ? (
          <>
            <div className="space-y-3 mb-2">
              <h1 className="header text-4xl">{t("checkEmail")}</h1>
              <p className="text-lg">
                {t("emailSentMessage")}{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>
            <hr className="bg-gray-600 h-0.5 mt-4" />
            <p className="text-violet-800 mt-6 underline text-sm ">
              <span className="hover:cursor-pointer">
                {t("sendAnotherLink")}
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <h1 className="header text-4xl">{t("title")}</h1>
              <p className="text-lg text-gray-700">{t("description")}</p>
            </div>
            <RegisterForm />
          </>
        )}
      </div>
    </CardWrapper>
  );
};

export default Page;
