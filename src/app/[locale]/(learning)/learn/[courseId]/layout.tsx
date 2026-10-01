import type { Metadata } from "next";
import { pageMetadata } from "@/app/lib/seo";
import { getUserIdServer } from "@/app/lib/getUserIdServer";

import { verifyPurchase } from "@/app/actions/enrolled-course/verifyPurschase";
import { logger } from "@/app/utils/logger";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, page: "learn", path: "/learn", index: false });
}

export default async function LearningCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const userId = await getUserIdServer();

  const verify = await verifyPurchase(
    userId as string,
    courseId as string
  );

  if (!verify.hasAccess) {
    logger.error(`User ${userId} does not have access to course ${courseId}`);
    redirect(`/my-courses/courses?access=false&reason=${verify.reason}`);
  }

  return <div>{children}</div>;
}
