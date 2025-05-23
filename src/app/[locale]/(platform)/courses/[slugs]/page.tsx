import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import CoursePageClient from "./ClientCoursePage";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";

export const dynamicParams = false;
export const revalidate = 72000;
export const dynamic = "force-static";

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
  const { slugs } = await params;
  const queryClient = getQueryClient();

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
