import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { getUserIdServer } from "@/app/lib/getUserIdServer";
import CoursePlayerPageClient from "../../components/CoursePlayerClient";
import LearningNavbar from "../../components/LearningNavbar";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const queryClient = getQueryClient();
  const userId = await getUserIdServer();

  await queryClient.prefetchQuery({
    queryKey: ["learning-course-data", userId, courseId],
    queryFn: () =>
      enrolledCourseActions.getLearningData(courseId, userId as string),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LearningNavbar courseId={courseId} userId={userId as string} />
      <CoursePlayerPageClient courseId={courseId} userId={userId} />
    </HydrationBoundary>
  );
}
