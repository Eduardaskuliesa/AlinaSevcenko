"use client";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const t = useTranslations("RegisterPage");
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const email = searchParams.get("email");

  return (
    <div className="bg-gray-100 max-w-xl w-full h-auto rounded-2xl border-2 border-gray-800 px-16 py-10">
      <div className="flex flex-col">
        {status === "pending" ? (
          <>
            <div className="space-y-3 mb-2">
              <h1 className="header text-4xl">Check your email</h1>
              <p className="text-lg">
                We&apos;ve just sent you a unique sign-in link to your email:{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>
            <hr className="bg-gray-600 h-0.5 mt-4" />
            <p className="text-violet-800 mt-6  underline text-sm ">
              <span className="hover:cursor-pointer">Send another link</span>
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
    </div>
  );
};

export default Page;
