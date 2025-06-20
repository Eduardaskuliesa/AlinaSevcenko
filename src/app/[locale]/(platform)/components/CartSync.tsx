"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CartSync() {
  const { syncWithBackend } = useCartStore();
  const { status } = useSession();
  const userId = useSession().data?.user.id;
  const pathname = usePathname();

  const shouldSkipSync = pathname?.includes("/checkout-success");

  useEffect(() => {
    if (userId && !shouldSkipSync && status === "authenticated") {
      syncWithBackend(userId);
    }
  }, [userId, syncWithBackend, shouldSkipSync, status]);

  return null;
}
