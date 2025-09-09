"use client";
import { BackButton } from "../components/AnimteBackButton";
import PreviewPlayer from "./components/PreviewPlayer";
import LessonDescription from "../components/LessonDescription";
import LessonContent from "../components/LessonContent";
import { useQuery } from "@tanstack/react-query";
import { getCourseWithPreviewLesson } from "@/app/actions/coursers/course/getCourseWithPrevie";
import StickyCartOptions from "./components/StickyCartOptions";

interface CoursePageClientProps {
  slugs: string;
}

export default function CoursePageClient({ slugs }: CoursePageClientProps) {
  const { data } = useQuery({
    queryKey: ["course", slugs],
    queryFn: () => getCourseWithPreviewLesson(slugs),
    staleTime: 1000 * 60 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            {course?.title}
          </h1>
        </div>
      </header>

      <section className="flex gap-8 mx-auto max-w-7xl h-full">
        <div className="w-[70%] h-auto px-4 py-4">
          <BackButton />
          {previewLesson && <PreviewPlayer lessonData={previewLesson} />}
          <LessonDescription courseData={course} />
          <LessonContent courseLessons={sortedLessons ?? []} />
        </div>
        <StickyCartOptions courseData={course}></StickyCartOptions>
      </section>
    </>
  );
}
