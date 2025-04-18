"use client";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("RegisterPage");
  
  return (
    <div className="bg-gray-100 max-w-xl w-full h-auto rounded-2xl border-2 border-gray-800 px-16 py-10">
      <div className="flex flex-col">
        <div className="space-y-3 mb-6">
          <h1 className="header text-5xl">{t("title")}</h1>
          <p className="text-xl text-gray-700">
            {t("description")}
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Page;