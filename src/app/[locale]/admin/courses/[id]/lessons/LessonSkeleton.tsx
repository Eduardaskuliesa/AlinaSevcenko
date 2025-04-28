import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import React from "react";

const LessonSkeleton = () => {
  return (
    <Skeleton className="p-4 rounded-md shadow-sm border mb-2 border-gray-200 flex items-center justify-end">
      <Loader2 size={18} className="animate-spin mr-2 text-primary" />
    </Skeleton>
  );
};

export default LessonSkeleton;
