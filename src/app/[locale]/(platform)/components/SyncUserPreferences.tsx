"use client";
import { useUserPreferencesStore } from "@/app/store/useUserPreferences";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SyncUserPreferences() {
  const { setPreferences, loading } = useUserPreferencesStore();
  const { status } = useSession();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !loading && !hasSynced.current) {
      hasSynced.current = true;
      setPreferences();
    }
  }, [status, loading, setPreferences]);

  return null;
}
