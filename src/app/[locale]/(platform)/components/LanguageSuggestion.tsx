"use client";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import toast from "react-hot-toast";

const ONE_DAY = 24 * 60 * 60 * 1000;

export default function LanguageSuggestion() {
  const { preferences } = useUserPreferencesStore();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (
      preferences?.languge &&
      params.locale !== preferences.languge &&
      !hasShown
    ) {
      const dismissKey = `lang-suggestion-dismissed`;
      const dismissedData = localStorage.getItem(dismissKey);

      let shouldShow = true;
      if (dismissedData) {
        const dismissedTime = parseInt(dismissedData);
        const oneDayAgo = Date.now() - ONE_DAY;
        shouldShow = dismissedTime < oneDayAgo;
      }

      if (shouldShow) {
        setHasShown(true);

        toast(
          (t) => (
            <div className="flex items-center gap-2">
              <span>Switch to preferred Lang?</span>
              <button
                onClick={() => {
                  router.push(pathname, { locale: preferences.languge });
                  toast.dismiss(t.id);
                }}
                className="bg-primary text-white px-2 py-1 rounded text-sm"
              >
                Switch
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(dismissKey, Date.now().toString());
                  toast.dismiss(t.id);
                }}
                className="text-gray-800 px-2 py-1 rounded-md bg-gray-200"
              >
                ✕
              </button>
            </div>
          ),
          {
            duration: Infinity,
            position: "bottom-right",
            style: {
              boxShadow: "none",
              backgroundColor: "",
            },
            className: "bg-slate-50 border-2 border-primary-light/60 shadow-md",
          }
        );
      }
    }
  }, [preferences, params.locale, router, pathname, hasShown]);

  return null;
}
