import { coursesAction } from "@/app/actions/coursers";
import { getCourseClient } from "@/app/actions/coursers/course/getCourseClient";
import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import PreviewPlayer from "./components/PreviewPlayer";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamicParams = false;
export const revalidate = 72000; // 20 hours revalidation

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
  const slugsData = await getSlugs();
  const matchedSlug = slugsData?.slugs?.find((slug) => slug.slug === slugs);
  const courseResponse = await getCourseClient(matchedSlug?.courseId as string);
  const course = courseResponse.course;

  const freeLessonId = course?.lessonOrder?.find(
    (lesson) => lesson.isPreview
  )?.lessonId;

  queryClient.prefetchQuery({
    queryKey: [`${freeLessonId}-lesson`],
    queryFn: () =>
      coursesAction.lessons.getLesson(
        course?.courseId as string,
        freeLessonId as string
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            {course?.title}
          </h1>
        </div>
      </header>
      <section className="bg-slate-400 flex flex-row mx-auto max-w-7xl">
        <div className="w-[60%] bg-blue-100 h-[500px]">
          <PreviewPlayer
            courseId={course?.courseId as string}
            lessonId={freeLessonId as string}
          ></PreviewPlayer>
        </div>
        <div className="w-[40%] bg-slate-900"></div>
      </section>
    </HydrationBoundary>
  );
}
