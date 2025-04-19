"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface RequirementItemProps {
  isValid: boolean | null;
  label: string;
  shouldShake: boolean;
}

function ValidateItem({ isValid, label, shouldShake }: RequirementItemProps) {
  return (
    <motion.div
      animate={
        shouldShake && isValid === false
          ? {
              x: [0, -5, 5, -5, 5, -3, 3, 0],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
      className={`px-3 py-2 rounded-full text-[15px] transition-colors duration-200 ${
        isValid === true
          ? "bg-green-50 text-green-700 border border-green-700"
          : isValid === false
          ? "bg-red-50 text-red-700 border border-red-700"
          : "bg-gray-50 text-gray-600 border border-gray-300"
      }`}
    >
      {label}
      {isValid === true && <span className="ml-1">✓</span>}
    </motion.div>
  );
}

interface ValidateBoxProps {
  isEmailValid: boolean | null;
  isLengthValid: boolean | null;
  hasCapital: boolean | null;
  shouldShakeInvalid?: boolean;
}

const ValidateBox = ({
  isEmailValid,
  isLengthValid,
  hasCapital,
  shouldShakeInvalid = false,
}: ValidateBoxProps) => {
  const t = useTranslations("RegisterPage");

  return (
    <div className="py-3">
      <h3 className="text-base font-medium text-gray-700 mb-2">
        {t("requirements")}
      </h3>
      <div className="flex gap-2 flex-wrap">
        <ValidateItem
          isValid={isEmailValid}
          label={t("validEmail")}
          shouldShake={shouldShakeInvalid}
        />
        <ValidateItem
          isValid={isLengthValid}
          label={t("minChars")}
          shouldShake={shouldShakeInvalid}
        />
        <ValidateItem
          isValid={hasCapital}
          label={t("capitalLetter")}
          shouldShake={shouldShakeInvalid}
        />
      </div>
    </div>
  );
};

export default ValidateBox;
