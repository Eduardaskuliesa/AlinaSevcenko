"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface RequirementItemProps {
  isValid: boolean | null;
  label: string;
}

function ValidateItem({ isValid, label }: RequirementItemProps) {
  return (
    <div
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
    </div>
  );
}

interface ValidateBoxProps {
  isEmailValid: boolean | null;
  isLengthValid: boolean | null;
  hasCapital: boolean | null;
}

const ValidateBox = ({
  isEmailValid,
  isLengthValid,
  hasCapital,
}: ValidateBoxProps) => {
  const t = useTranslations("RegisterPage");

  return (
    <div className="py-3">
      <h3 className="text-base font-medium text-gray-700 mb-2">
        {t("requirements")}
      </h3>
      <div className="flex gap-2 flex-wrap">
        <ValidateItem isValid={isEmailValid} label={t("validEmail")} />
        <ValidateItem isValid={isLengthValid} label={t("minChars")} />
        <ValidateItem isValid={hasCapital} label={t("capitalLetter")} />
      </div>
    </div>
  );
};

export default ValidateBox;
