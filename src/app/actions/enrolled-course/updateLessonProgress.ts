"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface UpdateLessonProgressParams {
  userId: string;
  courseId: string;
  lessonId: string;
  progress: number;
  completed?: boolean;
}

export async function updateLessonProgress({
  userId,
  courseId,
  lessonId,
  progress,
  completed = false,
}: UpdateLessonProgressParams) {
  try {
    logger.info(
      `Updating lesson progress for user ${userId}, course ${courseId}, lesson ${lessonId}`
    );

    const updateExpression = completed
      ? "SET lessonProgress.#lessonId.progress = :progress, lessonProgress.#lessonId.completedAt = :completedAt, lastWatchedAt = :lastWatchedAt, lastLessonId = :lessonId, updatedAt = :updatedAt"
      : "SET lessonProgress.#lessonId.progress = :progress, lastWatchedAt = :lastWatchedAt, lastLessonId = :lessonId, updatedAt = :updatedAt";

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: {
        "#lessonId": lessonId,
      },
      ExpressionAttributeValues: {
        ":progress": Math.round(progress),
        ":lastWatchedAt": new Date().toISOString(),
        ":lessonId": lessonId,
        ":updatedAt": new Date().toISOString(),
        ...(completed && { ":completedAt": new Date().toISOString() }),
      },
    });

    await dynamoDb.send(updateCommand);

    logger.info(
      `Successfully updated lesson progress for lesson ${lessonId} to ${progress}%`
    );

    return { success: true };
  } catch (error) {
    logger.error(
      `Error updating lesson progress for lesson ${lessonId}`,
      error
    );
    throw error;
  }
}
