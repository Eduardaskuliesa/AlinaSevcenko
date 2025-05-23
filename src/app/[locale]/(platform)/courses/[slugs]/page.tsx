import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import CoursePageClient from "./ClientCoursePage";

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
  const data = await getCourseWithPreviewLesson(slugs);
   

  if (!data || !data.course || !data.previewLesson) {
    return <div>Course not found</div>;
  }

 const { course, previewLesson, courseLessons } = data;

  return (
    <CoursePageClient
      course={course}
      previewLesson={previewLesson}
      courseLessons={courseLessons}
    />
  );
}
