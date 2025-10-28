"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

export function CheckoutSummarySkeleton() {
  const t = useTranslations("CheckoutSummary");
  
  return (
    <div className="w-[30%] mt-6 sticky top-[2rem] h-fit bg-white border-primary-light/60 border-2 rounded-lg pt-4 px-4 pb-6">
      <div className="flex items-center gap-2 mb-2">
        <Loader className="animate-spin h-4 w-4 text-primary" />
        <h3 className="font-semibold text-lg text-gray-800">
          {t("loadingSummary")}
        </h3>
      </div>

      <Skeleton className="h-4 bg-gray-200 rounded w-16 mb-4 animate-pulse" />

      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
        >
          <div className="flex-1">
            <Skeleton className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse" />
            <Skeleton className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <Skeleton className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-5 bg-gray-200 rounded w-12 animate-pulse" />
          <Skeleton className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Skeleton className="h-10 bg-gray-200 rounded w-full animate-pulse" />
        <Skeleton className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
      </div>
    </div>
  );
}
