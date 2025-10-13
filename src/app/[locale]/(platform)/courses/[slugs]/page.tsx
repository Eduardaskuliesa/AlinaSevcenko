import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import CoursePageClient from "./ClientCoursePage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { redirect } from "next/navigation";

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

export default async function CourseIdPage({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { slugs, locale } = await params;
  const queryClient = getQueryClient();

  const courseData = await getCourseWithPreviewLesson(slugs);

  if (!courseData?.course?.isPublished) {
    redirect(`/${locale}/courses?error=course-not-available`);
  }

  await queryClient.prefetchQuery({
    queryKey: ["course", slugs],
    queryFn: () => getCourseWithPreviewLesson(slugs),
  });

 
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursePageClient slugs={slugs} />
    </HydrationBoundary>
  );
}
