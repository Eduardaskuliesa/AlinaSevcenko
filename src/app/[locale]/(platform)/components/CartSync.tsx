"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CartSync() {
  const { syncWithBackend } = useCartStore();
  const userId = useSession().data?.user.id;

  useEffect(() => {
    if (userId) {
      syncWithBackend(userId);
    }
  }, [userId, syncWithBackend]);

  return null;
}
