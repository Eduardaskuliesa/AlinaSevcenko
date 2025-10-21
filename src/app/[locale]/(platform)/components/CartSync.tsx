"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CartSync() {
  const { syncWithBackend } = useCartStore();
  const session = useSession();
  const userId = session.data?.user.id;
  const status = session.status;

  const pathname = usePathname();

  const shouldSkipSync = pathname?.includes("/checkout-success");

  useEffect(() => {
    if (userId && !shouldSkipSync && status === "authenticated") {
      syncWithBackend(userId);
    }
  }, [userId, syncWithBackend, shouldSkipSync, status]);

  return null;
}
