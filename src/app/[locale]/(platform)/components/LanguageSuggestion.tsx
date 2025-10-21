"use client";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useRef } from "react";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";

export default function LanguageSuggestion() {
  const { preferences } = useUserPreferencesStore();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (
      preferences?.languge &&
      params.locale !== preferences.languge &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      router.push(pathname, { locale: preferences.languge });
    }
  }, [preferences?.languge, params.locale, router, pathname]);

  return null;
}
