"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";
import { EnrolledCourse } from "@/app/types/enrolled-course";

export async function getCourse(userId: string, courseId: string) {
  logger.info(`Fetching course ${courseId}`);
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
    });

    const course = await dynamoDb.send(getCommand);

    return {
      cousre: course.Item as EnrolledCourse,
    };
  } catch (error) {
    logger.error(`Error fetching course ${courseId}`, error);
    return {
      error: error,
    };
  }
}
