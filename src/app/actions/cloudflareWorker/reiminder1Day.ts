import { logger } from "@/app/utils/logger";

export async function reminder1Days(courseId: string, userId: string) {
  try {
    const response = await fetch(
      `${process.env.WORKER_URL}/schedule-expiry-1day`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WORKER_API_KEY || "",
        },
        body: JSON.stringify({
          courseId,
          userId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error scheduling reminder:", errorData);
      logger.error("Error scheduling reminder for 1day");
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Reminder scheduled successfully:", data);
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
