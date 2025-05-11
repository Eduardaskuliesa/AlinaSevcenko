import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="p-2 lg:p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          Categories
          <Loader size={24} className="animate-spin ml-2"></Loader>
        </h1>
        <Skeleton className="flex items-center gap-2 w-32 h-9"></Skeleton>
      </div>
      <div className="flex flex-col xxs:flex-row gap-4 mb-6">
        <Skeleton className="relative flex-1 h-9  w-[80%]"></Skeleton>
        <Skeleton className="h-9 w-44"></Skeleton>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className=" h-24 w-full rounded-md"></Skeleton>
        <Skeleton className="h-24 w-full rounded-md"></Skeleton>
      </div>
    </div>
  );
};

export default loading;
