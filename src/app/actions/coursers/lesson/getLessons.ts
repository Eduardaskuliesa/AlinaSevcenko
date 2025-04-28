import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getLessons(courseId: Course["courseId"]) {
  try {
    logger.info(`Fetching lessons for course ${courseId}`);
    const getCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `COURSE#${courseId}`,
      },
    });

    const response = await dynamoDb.send(getCommand);
    return response.Items as Lesson[];
  } catch (error) {
    logger.error(`Error fetching lessons for course ${courseId}`, error);
  }
}
