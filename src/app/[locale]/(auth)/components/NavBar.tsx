"use client";

import React from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const AuthNavbar = () => {
  const t = useTranslations("AuthNavbar");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params?.locale as string) || "lt";

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isVerifyEmailPage = pathname === "/verify-email";

  const localeCode = currentLocale.toUpperCase();

  const languages = [
    { code: "lt", name: t("lithuanian") },
    { code: "ru", name: t("russian") },
  ];

  const changeLanguage = (locale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, "") || "/";
    router.push(newPathname, { locale });
  };

  return (
    <div className="max-w-3xl w-full flex justify-between items-center px-4 mx-auto h-16 py-2 bg-gray-50 shadow-md border-2 border-gray-800 rounded-2xl">
      <Link
        href="/"
        className="px-4 py-2 bg-secondary rounded-lg font-medium text-gray-800 hover:bg-secondary-light transition"
      >
        {t("home")}
      </Link>

      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Globe size={20} className="text-gray-800" />
              <span className="font-bold text-gray-800">{localeCode}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 border-2 border-gray-800 space-y-1 bg-gray-50 rounded-lg shadow-md">
            <DropdownMenuLabel className="px-4 text-base">
              {t("chooseLanguage")}
            </DropdownMenuLabel>
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                className={`flex items-center gap-2 px-4 rounded-md py-2 cursor-pointer ${
                  currentLocale === language.code
                    ? "bg-secondary text-gray-800 font-medium"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                <span className="font-medium text-base">{language.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {!isLoginPage && (
          <Link
            href="/login"
            className="px-4 py-2 bg-secondary rounded-lg font-medium text-gray-800 hover:bg-secondary-light transition"
          >
            {t("login")}
          </Link>
        )}

        {!isRegisterPage && !isVerifyEmailPage && (
          <Link
            href="/register"
            className="px-4 py-2 bg-secondary rounded-lg font-medium text-gray-800 hover:bg-secondary-light transition"
          >
            {t("register")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthNavbar;
