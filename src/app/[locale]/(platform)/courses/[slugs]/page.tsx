import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import { getCourseBySlug } from "@/app/actions/coursers/course/getCourseBySlug";
import { seoActions } from "@/app/actions/seo";
import CoursePageClient from "./ClientCoursePage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { Suspense } from "react";

export const dynamicParams = true;
export const revalidate = 72000;

export async function generateStaticParams() {
  const slugsData = await getSlugs();
  const locales = ["lt", "ru"];

  const paths = [];

  for (const locale of locales) {
    for (const slug of slugsData?.slugs || []) {
      paths.push({
        locale,
        slugs: slug.slug,
      });
    }
  }

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { slugs, locale } = await params;

  const course = await getCourseBySlug(slugs);

  if (!course) {
    return {};
  }

  const seoData = await seoActions.getCourseSeo({
    courseId: course.courseId,
    locale: locale,
  });

  const metaTitle = seoData?.courseSeo?.metaTitle || "Online Course";
  const metaDescription =
    seoData?.courseSeo?.metaDescription ||
    "Transform your life with our comprehensive self-improvement course. Develop new skills, build better habits, and achieve your personal growth goals.";

  return {
    title: metaTitle,
    description: metaDescription,
  };
}

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { slugs, locale } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["course", slugs],
    queryFn: () => getCourseWithPreviewLesson(slugs),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <CoursePageClient slugs={slugs} locale={locale} />
      </Suspense>
    </HydrationBoundary>
  );
}
