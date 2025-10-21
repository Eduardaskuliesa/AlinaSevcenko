"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useCheckoutStore } from "@/app/store/useCheckoutStore";
import { useEffect } from "react";

export default function ClearCartComponent({
  userId,
}: {
  userId: string | undefined;
}) {
  const { clearCart } = useCartStore();
  const { clearCheckoutData } = useCheckoutStore();

  useEffect(() => {
    clearCheckoutData();
    clearCart(userId as string);
  }, [clearCart, userId, clearCheckoutData]);

  return null;
}
