"use client";
import React from "react";
import { useTranslations } from "next-intl";
import SocialLoginButtons from "../register/components/SocialLoginButtons";
import LoginForm from "./components/LoginForm";
import CardHeader from "../components/CardHeader";
import CardWrapper from "../components/CardWrapper";

const Page = () => {
  const t = useTranslations("LoginPage");

  return (
    <CardWrapper>
      <div className="flex flex-col">
        <div className="space-y-3 mb-6">
          <CardHeader text={t("title")} />
        </div>
        <SocialLoginButtons />
        <div className="bg-gray-600 h-0.5 my-4"></div>
        <LoginForm />
      </div>
    </CardWrapper>
  );
};

export default Page;
