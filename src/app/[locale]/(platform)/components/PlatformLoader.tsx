"use client";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function PlatformLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrated: preferencesHydrated } = useUserPreferencesStore();
  const { hydrated: cartHydrated } = useCartStore();
  const t = useTranslations("PlatformLoader");
  const { status } = useSession();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("loaderShown");
    if (shown) {
      setHasShownBefore(true);
      setHasLoaded(true);
    }
  }, []);

  const isLoading =
    status === "loading" || !preferencesHydrated || !cartHydrated;

  useEffect(() => {
    if (!isLoading && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
        sessionStorage.setItem("loaderShown", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, hasLoaded]);

  if (isLoading || !hasLoaded || !hasShownBefore) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: 120, height: 120 }}
            />

            <motion.div
              className="absolute inset-0 m-2 rounded-full border-2 border-primary-light"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: 104, height: 104 }}
            />

            <div
              className="relative flex items-center justify-center bg-white rounded-full shadow-lg"
              style={{ width: 120, height: 120 }}
            >
              <Book className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("loading")}
          </h2>

          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
