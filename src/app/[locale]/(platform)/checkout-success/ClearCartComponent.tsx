"use client";
import { useCartStore } from "@/app/store/useCartStore";
import { useEffect } from "react";

export default function ClearCartComponent() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
