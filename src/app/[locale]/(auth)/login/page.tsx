"use client";
import React from "react";
import { useTranslations } from "next-intl";
import SocialLoginButtons from "../register/components/SocialLoginButtons";
import LoginForm from "./components/LoginForm";

const Page = () => {
  const t = useTranslations("LoginPage");

  return (
    <div className="bg-gray-100 max-w-xl w-full h-auto rounded-2xl border-2 border-gray-800 px-16 py-10">
      <div className="flex flex-col">
        <div className="space-y-3 mb-6">
          <h1 className="header text-4xl">{t("title")}</h1>
        </div>
        <SocialLoginButtons />
        <hr className="bg-gray-600 h-0.5 mt-4" />
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
