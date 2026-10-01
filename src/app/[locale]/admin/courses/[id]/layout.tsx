import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NavBar from "./NavBar";
import AlertComponent from "./AlertComponent";
import { coursesAction } from "@/app/actions/coursers";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { categoryActions } from "@/app/actions/category";
import CourseStoreInitializer from "./CourseStoreInitializer";

interface CourseIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
    locale?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminSeo" });
  const { cousre } = await coursesAction.courses.getCourse(id);
  const courseTitle = cousre?.title || t("course");
  const suffix = `${courseTitle} | ${t("admin")} – Alina Savcenko`;
  return {
    title: { default: suffix, template: `%s – ${suffix}` },
  };
}

export default async function CourseIdLayout({
  children,
  params,
}: CourseIdLayoutProps) {
  const queryClient = getQueryClient();
  const resolvedParams = await params; 
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
        <CourseStoreInitializer courseId={courseId} />
        <div className="">{children}</div>
      </div>
    </HydrationBoundary>
  );
}