import { logger } from "@/app/utils/logger";

export async function reminder1Days(
  courseId: string,
  userId: string,
  expiresAt: string
) {
  try {
    if (expiresAt === "lifetime") {
      logger.info("Course has lifetime access, no reminder needed");
      return;
    }

    const response = await fetch(
      `${process.env.WORKER_URL}/schedule-expiry-1day?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WORKER_API_KEY || "",
        },
        body: JSON.stringify({
          userId,
          courseId,
          expiresAt,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error scheduling reminder:", errorData);
      console.error("Error scheduling reminder:", errorData);
      logger.error("Error scheduling reminder for 1day");
    }

    if (response.ok) {
      await response.json();
      logger.success("Reminder scheduled for 1day successfully");
    }

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Error in reminder1Day:", error);
    logger.error("Error in reminder1Day");
    return {
      success: false,
      error: "Failed to schedule reminder",
    };
  }
}
