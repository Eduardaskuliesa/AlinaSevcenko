import PreviewPlayer from "@/app/[locale]/(platform)/courses/[slugs]/components/PreviewPlayer";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import { redirect } from "next/navigation";
import React from "react";
import CourseAccordion from "../components/SlugAccordion";
import CoursePrice from "../components/CoursePrice";

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
        slug: slug.slug,
      });
    }
  }
  return paths;
}

export default async function CourseSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const courseData = await getCourseWithPreviewLesson(slug);
  const previewLesson = courseData?.previewLesson;

  const sortedLessons =
    courseData?.courseLessons?.sort((a, b) => {
      const orderA =
        courseData.course?.lessonOrder?.find(
          (order) => order.lessonId === a.lessonId
        )?.sort ?? 999;
      const orderB =
        courseData.course?.lessonOrder?.find(
          (order) => order.lessonId === b.lessonId
        )?.sort ?? 999;
      return orderA - orderB;
    }) ?? [];

  if (!courseData?.course) {
    return redirect(`/${locale}`);
  }

  if (!courseData?.course?.isPublished) {
    return redirect(`/${locale}`);
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-[52rem] flex flex-col justify-center mx-auto py-20 sm:py-12 px-2 sm:px-4">
        <h1 className="text-3xl font-medium tracking-wide sm:text-4xl lg:text-5xl mb-4">
          {courseData.course.title}
        </h1>
        {previewLesson && <PreviewPlayer lessonData={previewLesson} />}
        <CoursePrice course={courseData.course}></CoursePrice>
        <CourseAccordion
          courseData={courseData.course}
          courseLessons={sortedLessons}
        />
      </div>
    </main>
  );
}
