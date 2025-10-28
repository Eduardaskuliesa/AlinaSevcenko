import { userActions } from "@/app/actions/user";
import { withWorkerAuth } from "@/app/lib/withWorkerAuth";
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
    const preferences = await userActions.preferences.getPreferences(userId);
    console.log("User preferences fetched:", preferences);

    logger.info("Expiry reminder webhook triggered", {
      courseId,
      userId,
      daysUntilExpiry,
      reminderType,
    });

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
