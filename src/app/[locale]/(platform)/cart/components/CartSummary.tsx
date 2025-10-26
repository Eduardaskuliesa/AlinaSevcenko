"use client";
import { useCartStore } from "@/app/store/useCartStore";
import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const CartSummary = () => {
  const t = useTranslations("CartSummary");
  const { totalPrice, totalItems, cartItems } = useCartStore();
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  const params = useParams();
  const locale = params.locale;

  const handleCheckout = async () => {
    setRedirecting(true);

    router.push(`/${locale}/checkout`);
  };

  const formatDuration = (days: number) => {
    if (days === 0) return t("lifetime");
    if (days < 30) return `${days} ${t("days")}`;
    if (days < 365) return `${Math.floor(days / 30)} ${t("months")}`;
    return `${Math.floor(days / 365)} ${t("years")}`;
  };

  return (
    <div className="lg:w-[30%] mb-6 lg:mb-0 lg:mt-6 sticky top-[2rem] h-fit bg-white border-primary-light/60 border-2 rounded-lg pt-4 px-4 pb-6">
      <h3 className="font-semibold text-lg text-gray-800">{t("cartSummary")}</h3>
      <p className="text-gray-600">
        {totalItems} {totalItems === 1 ? t("item") : t("items")}
      </p>
      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t("yourCartIsEmpty")}</div>
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
              <span>{t("total")}:</span>
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
                  {t("processing")}
                  <Loader2 className="w-5 h-5 ml-2 text-white animate-spin"></Loader2>
                </>
              ) : (
                <>
                  {t("proceedToCheckout")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all text-white" />
                </>
              )}
            </motion.button>

            <Link href={"/courses"}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="w-full mt-4 flex  items-center justify-center underline text-gray-800  font-medium"
              >
                {t("continueShopping")}
              </motion.button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
