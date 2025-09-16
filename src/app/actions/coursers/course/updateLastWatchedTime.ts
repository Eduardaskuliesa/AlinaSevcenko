"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateLastWatchedTime(
  courseId: Course["courseId"],
  userId: string
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
        "SET lastWatchedAt = :lastWatchedAt, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":lastWatchedAt": timestamp,
        ":updatedAt": timestamp,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(updateCommand);
    if (response.$metadata.httpStatusCode === 200) {
      logger.success(`Updated last watched time`);
    }

    revalidateTag(`users-course-${userId}`);

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
