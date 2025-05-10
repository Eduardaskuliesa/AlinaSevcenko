"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateLanguage(
  courseId: Course["courseId"],
  language: string
) {
  try {
    const timestamp = new Date().toISOString();
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET #language = :language,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeNames: {
        "#language": "language",
      },
      ExpressionAttributeValues: {
        ":language": language,
        ":updatedAt": timestamp,
      },
    });

    await dynamoDb.send(updateCommand);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
  } catch (error) {
    logger.error(`Error updating course language for ${courseId}`, error);
    return {
      error: error,
    };
  }
}
