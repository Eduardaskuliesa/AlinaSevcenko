import { getSlugs } from "@/app/actions/coursers/course/getSlugs";
import PreviewPlayer from "./components/PreviewPlayer";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import { BackButton } from "../components/AnimteBackButton";
import LessonDescription from "../components/LessonDescription";
import LessonContent from "../components/LessonContent";

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

  if (!data || !data.course) {
    return <div>Course not found</div>;
  }

  const { course, previewLesson, courseLessons } = data;

  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            {course?.title}
          </h1>
        </div>
      </header>

      <section className="flex gap-8 mx-auto max-w-7xl  ">
        <div className="w-[70%] h-auto px-4 py-4">
          <BackButton></BackButton>

          {previewLesson && <PreviewPlayer lessonData={previewLesson} />}
          <LessonDescription courseData={course}></LessonDescription>
          <LessonContent courseLessons={courseLessons ?? []}></LessonContent>
        </div>
        <div className="w-[30%] bg-slate-900 max-h-[550px]"></div>
      </section>
    </>
  );
}
