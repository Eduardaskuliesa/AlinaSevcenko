import { coursesAction } from "@/app/actions/coursers";
import { emailActions } from "@/app/actions/email";
import { userActions } from "@/app/actions/user";
import { withWorkerAuth } from "@/app/lib/withWorkerAuth";
import { Language } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type ExpiryReminderRequestBody = {
  courseId: string;
  userId: string;
  daysUntilExpiry: 1 | 7;
  reminderType: "expiry-reminder-1-day" | "expiry-reminder-7-days";
};

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    logger.success("Expiry reminder webhook invoked");

    const { courseId, userId, daysUntilExpiry, reminderType } =
      (await req.json()) as ExpiryReminderRequestBody;

    if (!courseId || !userId || !daysUntilExpiry || !reminderType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const [course, preferences, user] = await Promise.all([
      coursesAction.courses.getCourseClient(courseId),
      userActions.preferences.getPreferences(userId),
      userActions.authentication.getUser(userId),
    ]);

    if (!course || !preferences || !user) {
      return NextResponse.json(
        { error: "Course or user not found" },
        { status: 404 }
      );
    }
    const email = user.email as string;
    const courseTitle = course.course?.title;
    const courseSlug = course.course?.slug;
    const language = preferences.preferences.languge as Language;

    switch (reminderType) {
      case "expiry-reminder-1-day":
        await emailActions.transactional.sendExpiryReminder({
          email,
          courseTitle: courseTitle!,
          courseSlug: courseSlug!,
          daysUntilExpiry,
          lang: language,
        });
        break;
      case "expiry-reminder-7-days":
        await emailActions.transactional.sendExpiryReminder({
          email,
          courseTitle: courseTitle!,
          courseSlug: courseSlug!,
          daysUntilExpiry,
          lang: language,
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in expiry reminder webhook:", error);
    return NextResponse.json(
      { error: "Failed to process expiry reminder webhook" },
      { status: 500 }
    );
  }
}

export const POST = withWorkerAuth(handler);
