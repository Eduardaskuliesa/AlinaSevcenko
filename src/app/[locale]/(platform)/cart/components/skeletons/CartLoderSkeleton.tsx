import { Skeleton } from "@/components/ui/skeleton";

export function CartLoaderSkeleton() {
  return (
    <div className="mb-4 shadow-md border rounded-lg bg-white border-gray-200 animate-pulse">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="w-24 h-16 bg-gray-200 rounded-md"></Skeleton>
          <div className="flex-1">
            <Skeleton className="h-5 bg-gray-200 rounded w-3/4 mb-2"></Skeleton>
            <Skeleton className="h-4 bg-gray-200 rounded w-1/2"></Skeleton>
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <Skeleton className="h-5 bg-gray-200 rounded w-20 mb-2"></Skeleton>
          <Skeleton className="h-4 bg-gray-200 rounded w-32"></Skeleton>
        </div>
        <div className="hidden sm:block flex-shrink-0">
          <Skeleton className="h-6 bg-gray-200 rounded w-16"></Skeleton>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <Skeleton className="h-4 bg-gray-200 rounded w-24 mb-2"></Skeleton>
        <div className="flex gap-2">
          <Skeleton className="h-12 bg-gray-200 rounded w-20"></Skeleton>
          <Skeleton className="h-12 bg-gray-200 rounded w-20"></Skeleton>
        </div>
      </div>
    </div>
  );
}
