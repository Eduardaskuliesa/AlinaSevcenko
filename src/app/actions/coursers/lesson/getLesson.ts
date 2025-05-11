"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function getLesson(
  courseId: Course["courseId"],
  lessonId: Lesson["lessonId"]
) {
  try {
     await verifyAdminAccess();
    logger.info(`Fetching lesson ${lessonId}`);
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${courseId}`,
        SK: `LESSON#${lessonId}`,
      },
    });

    const response = await dynamoDb.send(getCommand);
    return response.Item as Lesson;
  } catch (error) {
    logger.error(`Error fetching lesson ${lessonId}`, error);
    throw error;
  }
}
