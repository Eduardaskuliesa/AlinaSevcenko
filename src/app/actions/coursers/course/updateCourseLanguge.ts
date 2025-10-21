"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateCourseSettings(
  courseId: Course["courseId"],
  language: string,
  sort: number
) {
  try {
    await verifyAdminAccess();
    const timestamp = new Date().toISOString();

    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const courseData = (await dynamoDb.send(getCommand)).Item as Course;

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
    revalidateTag(`course-client-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag(`client-courses`);
    revalidatePath(`/lt/courses/${courseData.slug}`);
    revalidatePath(`/ru/courses/${courseData.slug}`);
  } catch (error) {
    logger.error(`Error updating course language for ${courseId}`, error);
    return {
      error: error,
    };
  }
}
