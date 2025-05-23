import React from "react";
import RegisterForm from "./components/RegisterForm";
import { getTranslations } from "next-intl/server";
import CardWrapper from "../components/CardWrapper";

export const dynamic = "force-static";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    email?: string;
  }>;
}


export default async function Page({ searchParams }: PageProps) {
  const t = await getTranslations("RegisterPage");
  const params = await searchParams;
  
  const status = params.status;
  const email = params.email;

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
            <p className="text-violet-800 mt-6 underline text-sm">
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
}