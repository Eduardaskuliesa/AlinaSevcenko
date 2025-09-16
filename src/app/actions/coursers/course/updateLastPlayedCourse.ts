"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateLastPlayedLesson(
  courseId: Course["courseId"],
  userId: string,
  lastLessonId: string,
  lastLessonWatchTime: number
) {
  try {
    const timestamp = new Date().toISOString();
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression:
        "SET lastWatchedAt = :lastWatchedAt, lastLessonId = :lastLessonId, lastLessonWatchTime = :lastLessonWatchTime, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":lastWatchedAt": timestamp,
        ":lastLessonId": lastLessonId,
        ":lastLessonWatchTime": lastLessonWatchTime,
        ":updatedAt": timestamp,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(updateCommand);
    if (response.$metadata.httpStatusCode === 200) {
      logger.success(
        `Updated last played lesson for user ${userId} in course ${courseId}`
      );
    }

    revalidateTag(`learning-data-${courseId}-${userId}`);

    return {
      success: true,
      messsage: "SUCCESS",
    };
  } catch (error) {
    logger.error(`Error updating lastLessonId ${courseId}`, error);
    return {
      error: error,
    };
  }
}
