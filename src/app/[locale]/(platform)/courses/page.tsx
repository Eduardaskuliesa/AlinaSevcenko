import React from "react";
import CoursePageContent from "./CoursePage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { coursesAction } from "@/app/actions/coursers";
import { categoryActions } from "@/app/actions/category";

export default async function CoursePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["client-courses"],
    queryFn: () => coursesAction.courses.getAllCoursesUP(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["client-categories"],
    queryFn: () => categoryActions.getAllCategoriesUP(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="h-[9rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-12 font-semibold text-gray-100">
            Courses
          </h1>
        </div>
      </header>
      <CoursePageContent />
    </HydrationBoundary>
  );
}
