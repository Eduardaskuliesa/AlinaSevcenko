"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useEffect } from "react";

export default function ClearCartComponent({
  userId,
}: {
  userId: string | undefined;
}) {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart(userId as string);
  }, [clearCart, userId]);

  return null;
}
