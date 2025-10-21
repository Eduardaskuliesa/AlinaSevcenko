"use client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useCheckoutStore } from "@/app/store/useCheckoutStore";
import CheckoutSummary from "./components/CheckoutSummary";
import { BackToCartButton } from "./components/BackToCartButton";
import PaymentList from "./components/PaymentList";
import { CartSummarySkeleton } from "../cart/components/skeletons/CartSummarySkeleton";
import PaymentListSkeleton from "./components/PaymentListSkeleton";
import { useCartStore } from "@/app/store/useCartStore";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = () => {
  const { clientSecret } = useCheckoutStore();
  const [elementsKey, setElementsKey] = useState(0);
  const { cartItems, hydrated } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    if (clientSecret) {
      setElementsKey((prev) => prev + 1);
    }
  }, [clientSecret]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (clientSecret) {
      setElementsKey((prev) => prev + 1);
    }
  }, [clientSecret]);

  useEffect(() => {
    if (isHydrated && hydrated) {
      if (cartItems.length === 0) {
        router.push("/courses");
        toast.error("Please add items to your cart before checkout.");
      }
      if (!clientSecret && cartItems.length > 0) {
        router.push("/cart");
        toast.error("Please proceed to checkout from the cart page.");
      }
    }
  }, [clientSecret, cartItems.length, router, isHydrated, hydrated]);

  if (!isHydrated || !hydrated || !clientSecret) {
    return (
      <>
        <header className="h-[5rem]  bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold text-gray-100">
              Checkout
            </h1>
          </div>
        </header>
        <section className="flex flex-col lg:flex-row gap-8 mx-auto max-w-7xl">
          <div className="lg:w-[70%] h-auto px-4 py-4 mt-2">
            <BackToCartButton />
            <PaymentListSkeleton />
          </div>
          <CartSummarySkeleton />
        </section>
      </>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    locale: locale as StripeElementsOptions["locale"],
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorBackground: "#f8fafc",
        colorText: "#111827",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
      rules: {
        ".Input": {
          border: "1px solid #c9bdc7",
          boxShadow: "none",
        },
        ".Input:focus": {
          border: "1px solid #998ea7",
          boxShadow: "0 0 0 1px #998ea7",
        },
        ".Tab": {
          border: "1px solid #c9bdc7",
          backgroundColor: "#f9fafb",
        },
        ".Tab--selected": {
          backgroundColor: "#ffffff",
          border: "1px solid #998ea7",
        },
      },
    },
  };

  return (
    <Elements key={elementsKey} stripe={stripePromise} options={options}>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold text-gray-100">
            Checkout
          </h1>
        </div>
      </header>
      <section className="flex flex-col lg:flex-row gap-2 lg:gap-8 mx-auto max-w-7xl">
        <div className="lg:w-[70%] h-auto px-4 py-4 mt-2">
          <BackToCartButton />
          <PaymentList />
        </div>
        <CheckoutSummary />
      </section>
    </Elements>
  );
};

export default CheckoutPage;
