/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCartStore } from "@/app/store/useCartStore";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import { CheckoutSummarySkeleton } from "./CheckoutSummarySkeleton";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useParams } from "next/navigation";
import { useCheckoutStore } from "@/app/store/useCheckoutStore";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const CheckoutSummary = () => {
  const { totalPrice, totalItems, cartItems, hydrated } = useCartStore();
  const { clientSecret, setCheckoutData, checkoutItems } = useCheckoutStore();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const params = useParams();
  const locale = params.locale;
  const session = useSession();
  const userId = session.data?.user.id;

  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (clientSecret && checkoutItems.length > 0 && !isUpdatingRef.current) {
      const cartItemsData = cartItems
        .map((item) => ({
          courseId: item.courseId,
          price: item.price,
          accessPlanId: item.accessPlanId,
          accessDuration: item.accessDuration,
        }))
        .sort((a, b) => a.courseId.localeCompare(b.courseId));

      const checkoutItemsData = checkoutItems
        .map((item) => ({
          courseId: item.courseId,
          price: item.price,
          accessPlanId: item.accessPlanId,
          accessDuration: item.accessDuration,
        }))
        .sort((a, b) => a.courseId.localeCompare(b.courseId));

      const itemsChanged =
        JSON.stringify(cartItemsData) !== JSON.stringify(checkoutItemsData);

      if (itemsChanged) {
        isUpdatingRef.current = true;

        const recreatePaymentIntent = async () => {
          try {
            const response = await fetch("/api/create-payment-intent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cartItems, userId }),
            });

            const { clientSecret: newClientSecret } = await response.json();
            setCheckoutData({
              items: cartItems,
              clientSecret: newClientSecret,
              userId: userId || "",
            });

            toast.success("Cart updated, please proceed with payment");
          } finally {
            isUpdatingRef.current = false;
          }
        };

        recreatePaymentIntent();
      }
    }
  }, [cartItems, checkoutItems, clientSecret]);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${locale}/checkout-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred");
      }
    } catch (err) {
      if (err) setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (days: number) => {
    if (days === 0) return "Lifetime";
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  if (!hydrated) return <CheckoutSummarySkeleton />;

  return (
    <div className="lg:w-[30%]  lg:mt-6 sticky top-[2rem] h-fit bg-white border-primary-light/60 border-2 rounded-lg pt-4 mx-4 mb-4 px-4 pb-6">
      <h3 className="font-semibold text-lg text-gray-800">Checkout summary</h3>
      <p className="text-gray-600">
        {totalItems} {totalItems === 1 ? "item" : "items"}
      </p>
      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Your cart is empty</div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.courseId}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatDuration(item.accessDuration)}
                </p>
              </div>
              <div className="font-semibold">€{item.price}</div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>€{totalPrice}</span>
            </div>
          </div>

          <div className="pt-4 space-y-3 ">
            <motion.button
              onClick={handlePayment}
              disabled={!stripe || isProcessing}
              whileTap={{ scale: 0.96 }}
              className="w-full flex group items-center justify-center hover:bg-primary/90 transition-colors bg-primary py-2 rounded-md text-gray-100 font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  Processing...
                  <Loader2 className="w-5 h-5 ml-2 text-white animate-spin" />
                </>
              ) : (
                <>
                  Complete Payment
                  <CreditCard className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all text-white" />
                </>
              )}
            </motion.button>

            {errorMessage && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md mt-2 border-red-400 border">
                {errorMessage}
              </div>
            )}

            <Link href={"/courses"}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 flex  items-center justify-center underline text-gray-800  font-medium"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutSummary;
