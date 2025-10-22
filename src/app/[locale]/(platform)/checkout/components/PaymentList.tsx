"use client";
import React, { useState } from "react";
import { PaymentElement, useElements } from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

const PaymentList = () => {
  const t = useTranslations("CheckoutPage");
  const elements = useElements();
  const [isElementReady, setIsElementReady] = useState(false);

  const showLoading = !elements || !isElementReady;

  return (
    <div className="w-full bg-white p-3 lg:p-6 rounded-lg border-2 border-primary-light/60 mt-2">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {t("paymentDetails")}
      </h2>

      {showLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-gray-600">{t("loadingPaymentOptions")}</p>
          </div>
        </div>
      )}

      <div className={showLoading ? "opacity-0 absolute" : "opacity-100"}>
        <PaymentElement
          onReady={() => setIsElementReady(true)}
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true,
            },
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PaymentList;
