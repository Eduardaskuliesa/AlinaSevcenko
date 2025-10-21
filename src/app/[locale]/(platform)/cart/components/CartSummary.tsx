"use client";
import { useCartStore } from "@/app/store/useCartStore";
import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCheckoutStore } from "@/app/store/useCheckoutStore";

const CartSummary = () => {
  const { totalPrice, totalItems, cartItems } = useCartStore();
  const { setCheckoutData } = useCheckoutStore();
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  const params = useParams();
  const locale = params.locale;
  const userId = useSession().data?.user.id;

  const handleCheckout = async () => {
    setRedirecting(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItems,
          userId: userId,
        }),
      });
      const { clientSecret } = await response.json();
      if (clientSecret) {
        setCheckoutData({
          clientSecret: clientSecret,
          items: cartItems,
          userId: userId || "",
        });
        router.push(`/${locale}/checkout`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setRedirecting(false);
    }
  };

  const formatDuration = (days: number) => {
    if (days === 0) return "Lifetime";
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  return (
    <div className="lg:w-[30%] mb-6 lg:mb-0 lg:mt-6 sticky top-[2rem] h-fit bg-white border-primary-light/60 border-2 rounded-lg pt-4 px-4 pb-6">
      <h3 className="font-semibold text-lg text-gray-800">Cart Summary</h3>
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
              onClick={handleCheckout}
              whileTap={{ scale: 0.96 }}
              className="w-full flex group  items-center justify-center hover:bg-primary/90 transition-colors bg-primary py-2 rounded-md text-gray-100  font-medium"
            >
              {redirecting ? (
                <>
                  Processing...
                  <Loader2 className="w-5 h-5 ml-2 text-white animate-spin"></Loader2>
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all text-white" />
                </>
              )}
            </motion.button>

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

export default CartSummary;
