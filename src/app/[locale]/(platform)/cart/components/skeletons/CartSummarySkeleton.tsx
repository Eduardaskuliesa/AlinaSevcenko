"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export function CartSummarySkeleton() {
  const t = useTranslations("CartSummary");
  
  return (
    <div className="lg:w-[30%] h-[200px] mt-6 sticky top-[2rem] bg-white border-primary-light/60 border-2 rounded-lg p-4 mx-4">
      <div className="flex items-center gap-2 mb-4">
        <Loader className="animate-spin h-4 w-4 text-primary" />
        <h3 className="font-semibold text-lg text-gray-800">
          {t("loadingSummary")}
        </h3>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></Skeleton>
        <Skeleton className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></Skeleton>
      </div>
    </div>
  );
}
