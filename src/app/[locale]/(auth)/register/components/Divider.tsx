import React from "react";
import { useTranslations } from "next-intl";
const Divider = () => {
  const t = useTranslations("RegisterPage");
  return (
    <div className="relative flex items-center my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-600 text-lg">{t("or")}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default Divider;
