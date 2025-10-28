import { logger } from "@/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type ExpiryReminderRequestBody = {
  courseId: string;
  userId: string;
  daysUntilExpiry: 1 | 7;
  reminderType: "expiry-reminder-1-day" | "expiry-reminder-7-days";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.WORKER_URL}`,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
  try {
    logger.info("Expiry reminder webhook triggered successfully");
    const allowedOrigin = req.headers.get("x-worker-origin");

    if (allowedOrigin !== process.env.WORKER_URL) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403, headers: corsHeaders }
      );
    }

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (token !== process.env.NEXTJS_APP_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { courseId, userId, daysUntilExpiry, reminderType } =
      (await req.json()) as ExpiryReminderRequestBody;

    if (!courseId || !userId || !daysUntilExpiry || !reminderType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    logger.info("Expiry reminder webhook triggered", {
      courseId,
      userId,
      daysUntilExpiry,
      reminderType,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    logger.error("Error in expiry reminder webhook:", error);
    return NextResponse.json(
      { error: "Failed to process expiry reminder webhook" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
