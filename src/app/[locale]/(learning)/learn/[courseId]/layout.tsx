import { getUserIdServer } from "@/app/lib/getUserIdServer";
import LearningNavbar from "../../components/LearningNavbar";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { logger } from "@/app/utils/logger";
import { redirect } from "next/navigation";

export default async function LearningCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const userId = await getUserIdServer();

  const verify = await enrolledCourseActions.verifyPurchase(
    courseId as string,
    userId as string
  );

  if (verify.hasAccess) {
    logger.info(`User ${userId} has access to course ${courseId}`);
  }

  if (!verify.hasAccess) {
    logger.error(`User ${userId} does not have access to course ${courseId}`);
    redirect(`/my-courses/courses?access=false&reason=${verify.reason}`);
  }

  return (
    <div className="h-screen">
      <LearningNavbar courseId={courseId} userId={userId as string} />
      {children}
    </div>
  );
}
