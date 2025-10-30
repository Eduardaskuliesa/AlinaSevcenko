"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";

export default function CartSync() {
  const { syncWithBackend, addToCart } = useCartStore();
  const session = useSession();
  const router = useRouter();
  const userId = session.data?.user.id;

  const pathname = usePathname();
  const isCartPath = pathname?.includes("/cart");
  const hasProcessedPending = useRef(false);

  const shouldSkipSync = pathname?.includes("/checkout-success");

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return null;
  };

  const clearCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  };

  useEffect(() => {
    if (!userId || shouldSkipSync) return;

    const processPendingItem = async () => {
      const pendingItem = getCookie("pendingItem");

      if (pendingItem && !hasProcessedPending.current) {
        try {
          console.log("Processing pending item from cookie:", pendingItem);

          await syncWithBackend(userId);

          const item = JSON.parse(pendingItem);
          await addToCart({ ...item, userId }, item.isFromPrice);

          clearCookie("pendingItem");
          hasProcessedPending.current = true;
          NProgress.done();
          if (!isCartPath) {
            router.push("/cart");
          }
        } catch (error) {
          console.error("Failed to process pending item:", error);
          clearCookie("pendingItem");
        }
        return;
      }
      NProgress.done();
      syncWithBackend(userId);
    };

    processPendingItem();
  }, [userId, syncWithBackend, shouldSkipSync, addToCart, router, isCartPath]);

  return null;
}
