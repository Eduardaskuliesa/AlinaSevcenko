import React from "react";
import NavBar from "./NavBar";
import AlertComponent from "./AlertComponent";
import { coursesAction } from "@/app/actions/coursers";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { categoryActions } from "@/app/actions/category";

interface CourseIdLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
    locale?: string;
  };
}
export default async function CourseIdLayout({
  children,
  params,
}: CourseIdLayoutProps) {
  const queryClient = getQueryClient();
  const resolvedParams = await Promise.resolve(params);
  const courseId = resolvedParams.id;

  await queryClient.prefetchQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => categoryActions.getCategories(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-7xl lg:px-6">
        <NavBar />
        <AlertComponent />
        {/* Content */}
        <div className="">{children}</div>
      </div>
    </HydrationBoundary>
  );
}
