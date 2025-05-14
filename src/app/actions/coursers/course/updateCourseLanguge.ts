"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateCourseSettings(
  courseId: Course["courseId"],
  language: string,
  sort: number
) {
  try {
    await verifyAdminAccess();
    const timestamp = new Date().toISOString();
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET #language = :language,
            sort = :sort,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeNames: {
        "#language": "language",
      },
      ExpressionAttributeValues: {
        ":sort": sort,
        ":language": language,
        ":updatedAt": timestamp,
      },
    });

    await dynamoDb.send(updateCommand);

    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag(`client-courses`);
  } catch (error) {
    logger.error(`Error updating course language for ${courseId}`, error);
    return {
      error: error,
    };
  }
}
