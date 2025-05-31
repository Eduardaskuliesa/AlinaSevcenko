"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/app/store/useCartStore";

import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { cartItems } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (cartItems.length === 0) return;
    fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cartItems]);

  if (cartItems.length === 0) {
    return <div>Your cart is empty</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
    wallets: {
      applePay: "auto",
      googlePay: "auto",
    },
  };
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
