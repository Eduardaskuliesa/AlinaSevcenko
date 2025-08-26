import { Lesson } from "@/app/types/course";
import { coursesAction } from "..";
import { getCourseClient } from "./getCourseClient";
import { getSlugs } from "./getSlugs";

export async function getCourseWithPreviewLesson(slug: string) {
  const slugsData = await getSlugs();

  const matchedSlug = slugsData?.slugs?.find((s) => s.slug === slug);

  if (!matchedSlug?.courseId) {
    return null;
  }

  const courseResponse = await getCourseClient(matchedSlug.courseId);
  const course = courseResponse.course;

  const courseLessons = (await coursesAction.lessons.getClientLessons(
    course?.courseId as string
  )) as Lesson[];

  const previewLesson = course?.lessonOrder?.find((lesson) => lesson.isPreview);

  if (previewLesson?.lessonId) {
    const lessonData = await coursesAction.lessons.getLesson(
      course?.courseId as string,
      previewLesson.lessonId
    );

    return {
      course,
      courseLessons,
      previewLesson: lessonData,
      previewLessonId: previewLesson.lessonId,
    };
  }

  return { course, previewLesson: null, previewLessonId: null };
}
