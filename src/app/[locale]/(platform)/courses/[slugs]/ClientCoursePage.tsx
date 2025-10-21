"use client";
import { BackButton } from "../components/AnimteBackButton";
import PreviewPlayer from "./components/PreviewPlayer";
import LessonDescription from "../components/LessonDescription";
import LessonContent from "../components/LessonContent";
import { useQuery } from "@tanstack/react-query";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import StickyCartOptions from "./components/StickyCartOptions";
import MobileCartDrawer from "./components/MobileCartDrawer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CoursePageClientProps {
  slugs: string;
  locale: string;
}

export default function CoursePageClient({
  slugs,
  locale,
}: CoursePageClientProps) {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["course", slugs],
    queryFn: () => getCourseWithPreviewLesson(slugs),
  });

  useEffect(() => {
    if (data && !data.course?.isPublished) {
      router.push(`/${locale}/courses?error=course-not-available`);
    }
  }, [data, locale, router]);

  if (!data?.course?.isPublished) {
    return null;
  }

  if (!data?.course) return <div>Course not found</div>;

  const { course, previewLesson, courseLessons } = data;

  const sortedLessons =
    courseLessons?.sort((a, b) => {
      const orderA =
        course?.lessonOrder?.find((order) => order.lessonId === a.lessonId)
          ?.sort ?? 999;
      const orderB =
        course?.lessonOrder?.find((order) => order.lessonId === b.lessonId)
          ?.sort ?? 999;
      return orderA - orderB;
    }) ?? [];

  return (
    <>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-lg px-2 md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-4xl  lg:text-5xl font-times mt-4 font-semibold text-gray-100">
            {course?.title}
          </h1>
        </div>
      </header>

      <section className="flex gap-8 mx-auto max-w-7xl h-full">
        <div className="w-full lg:w-[70%] h-auto px-2 lg:px-4 py-4">
          <BackButton />
          {previewLesson && <PreviewPlayer lessonData={previewLesson} />}
          <LessonDescription courseData={course} />
          <LessonContent courseLessons={sortedLessons ?? []} />
        </div>
        <StickyCartOptions courseData={course} />
        <MobileCartDrawer courseData={course} />
      </section>
    </>
  );
}
