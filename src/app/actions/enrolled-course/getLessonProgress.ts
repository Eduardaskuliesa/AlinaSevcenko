"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function getLessonProgress(userId: string, courseId: string) {
  try {
    logger.info(
      `Fetching lesson progress for user ${userId}, course ${courseId}`
    );

    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
      ProjectionExpression: "lessonProgress",
    });

    const response = await dynamoDb.send(getCommand);

    if (!response.Item) {
      logger.error(`No lesson progress found for course ${courseId}`);
      return null;
    }

    return response.Item.lessonProgress as Record<
      string,
      {
        progress: number;
        completedAt: string;
        wasReworked: boolean;
      }
    >;
  } catch (error) {
    logger.error(
      `Error fetching lesson progress for course ${courseId}`,
      error
    );
    throw error;
  }
}
