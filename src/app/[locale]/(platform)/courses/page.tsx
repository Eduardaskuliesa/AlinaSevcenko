import React from "react";
import CoursePageContent from "./CoursePage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { coursesAction } from "@/app/actions/coursers";
import { categoryActions } from "@/app/actions/category";
import { getTranslations } from "next-intl/server";

export default async function CoursePage() {
  const queryClient = getQueryClient();
  const t = await getTranslations("CoursesPage");

  queryClient.prefetchQuery({
    queryKey: ["client-courses"],
    queryFn: coursesAction.courses.getAllCoursesUP,
  });

  queryClient.prefetchQuery({
    queryKey: ["client-categories"],
    queryFn: categoryActions.getAllCategoriesUP,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-lg px-2 md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-4xl  lg:text-5xl font-times mt-4 font-semibold text-gray-100">
            {t("header")}
          </h1>
        </div>
      </header>
      <CoursePageContent />
    </HydrationBoundary>
  );
}
