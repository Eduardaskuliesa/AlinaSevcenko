"use client";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const LanguagePreference = () => {
  const t = useTranslations("UserProfilePage");

  const params = useParams();
  const session = useSession();
  const userId = session.data?.user.id;
  const router = useRouter();
  const currentLocale = params.locale as string;
  const { updatePreferences } = useUserPreferencesStore();

  const changeLanguage = (locale: string) => {
    if (locale === currentLocale) return;
    router.push(`/${locale}/user/profile`);
    updatePreferences({ languge: locale }, userId || "");
  };

  return (
    <div className="space-y-2">
      <Label>{t("languagePreference")}</Label>
      <div className="flex gap-2">
        <Button
          onClick={() => changeLanguage("lt")}
          variant="secondary"
          className={`${
            currentLocale === "lt"
              ? "bg-secondary"
              : "bg-slate-50 border hover:bg-slate-100"
          } flex-1 gap-2`}
        >
          <Image
            width={50}
            height={40}
            src="https://flagcdn.com/w40/lt.png"
            alt="LT"
            className="w-5 h-4"
          />
          <span>{t("lithuanian")}</span>
        </Button>
        <Button
          onClick={() => changeLanguage("ru")}
          variant="secondary"
          className={`${
            currentLocale === "ru"
              ? "bg-secondary"
              : "bg-slate-50 border hover:bg-slate-100"
          } flex-1 gap-2`}
        >
          <Image
            width={50}
            height={40}
            src="https://flagcdn.com/w40/ru.png"
            alt="RU"
            className="w-5 h-4"
          />
          <span>{t("russian")}</span>
        </Button>
      </div>
    </div>
  );
};

export default LanguagePreference;
