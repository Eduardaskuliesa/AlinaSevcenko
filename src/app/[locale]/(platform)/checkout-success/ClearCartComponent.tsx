"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useEffect } from "react";

export default function ClearCartComponent({
  userId,
}: {
  userId: string | undefined;
}) {
  console.log("ClearCartComponent rendered with userId:", userId);
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart(userId as string);
  }, [clearCart, userId]);

  return null;
}
