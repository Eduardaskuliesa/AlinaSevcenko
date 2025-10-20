"use client";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const LanguagePreference = () => {
  const params = useParams();
  const router = useRouter();
  const currentLocale = params.locale as string;
  const { updatePreferences } = useUserPreferencesStore();

  const changeLanguage = (locale: string) => {
    if (locale === currentLocale) return;
    updatePreferences({ languge: locale });
    router.push(`/${locale}/user/profile`);
  };

  return (
    <div className="space-y-2">
      <Label>Language Preference</Label>
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
          <span>Lithuanian</span>
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
          <span>Russian</span>
        </Button>
      </div>
    </div>
  );
};

export default LanguagePreference;
