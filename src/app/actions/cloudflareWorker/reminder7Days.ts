import { logger } from "@/app/utils/logger";

export async function reminder7Days(
  courseId: string,
  userId: string,
  expiresAt: string
) {
  try {
    const expiryData = {
      userId,
      courseId,
      expiresAt,
    };
    if (expiresAt === "lifetime") {
      logger.info("Course has lifetime access, no reminder needed");
      return;
    }
    const expiryTime = new Date(expiresAt).getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const timeUntilExpiry = expiryTime - Date.now();

    if (timeUntilExpiry <= sevenDaysInMs) {
      logger.info("Expires date is less than 7 days, no reminder needed");
      return;
    }
    const response = await fetch(
      `${process.env.WORKER_URL}/schedule-expiry-7days?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WORKER_API_KEY || "",
        },
        body: JSON.stringify(expiryData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      console.error("Error scheduling reminder:", errorData);
    }

    if (response.ok) {
      await response.json();
      logger.success("Reminder scheduled for 7days successfully");
    }

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Error in reminder7Days:", error);
    logger.error("Error in reminder7Days");
    return {
      success: false,
      error: "Failed to schedule reminder",
    };
  }
}
