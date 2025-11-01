"use client";
import { useLocale } from "next-intl";
const useGetLocale = () => {
  const locale = useLocale();
  return { locale };
};

export default useGetLocale;
