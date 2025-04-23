import { Course } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";

export async function getCourse(courseId: Course["courseId"]) {
  logger.info(`Fetching course ${courseId}`);
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const course = await dynamoDb.send(getCommand);

    return {
      cousre: course.Item as Course,
    };
  } catch (error) {
    logger.info(`Fetching course ${courseId}`);
    return {
      error: error,
    };
  }
}
