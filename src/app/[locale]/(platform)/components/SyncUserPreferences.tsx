/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SyncUserPreferences() {
  const { setPreferences, loading } = useUserPreferencesStore();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && !loading) {
      setPreferences();
    }
  }, [status]);

  return null;
}
