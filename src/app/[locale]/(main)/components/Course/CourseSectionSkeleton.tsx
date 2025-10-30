import { Skeleton } from "@/components/ui/skeleton";

export default function CourseSectionSkeleton() {
  return (
    <section className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Skeleton className="h-12 w-48 md:w-64 mx-auto" />
      <div className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-md" />
        </div>
      </div>
    </section>
  );
}
