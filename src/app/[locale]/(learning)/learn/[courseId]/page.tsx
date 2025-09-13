import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { getUserIdServer } from "@/app/lib/getUserIdServer";
import { coursesAction } from "@/app/actions/coursers";
import CoursePlayerPageClient from "../../components/CoursePlayerClient";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const queryClient = getQueryClient();

  const userId = await getUserIdServer();

  await queryClient.prefetchQuery({
    queryKey: ["learning-course", courseId],
    queryFn: () => enrolledCourseActions.getCourse(courseId, userId as string),
  });

  await queryClient.prefetchQuery({
    queryKey: ["learning-lessons", courseId],
    queryFn: () => enrolledCourseActions.getLessons(courseId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourseClient(courseId),
  });

  // await queryClient.prefetchQuery({
  //   queryKey: ["learning-course-data", userId, courseId],
  //   queryFn: () =>
  //     enrolledCourseActions.getLearningData(courseId, userId as string),
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursePlayerPageClient courseId={courseId} userId={userId} />
    </HydrationBoundary>
  );
}
