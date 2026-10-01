import "server-only";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface CoursePreferences {
  courseId: string;
  expiresAt: string | "lifetime";
}

export async function updateCoursePreferences(
  userId: string,
  coursePreferences: CoursePreferences[]
) {
  try {
    const key = { PK: `PREFERENCE#${userId}`, SK: `USER#${userId}` };
    const existing = await dynamoDb.send(
      new GetCommand({ TableName: dynamoTableName, Key: key })
    );

    const byCourse = new Map<string, CoursePreferences>(
      ((existing.Item?.courseAcess as CoursePreferences[]) || []).map((c) => [
        c.courseId,
        c,
      ])
    );
    coursePreferences.forEach((c) => byCourse.set(c.courseId, c));

    await dynamoDb.send(
      new UpdateCommand({
        TableName: dynamoTableName,
        Key: key,
        UpdateExpression: "SET courseAcess = :courseAcess",
        ExpressionAttributeValues: {
          ":courseAcess": Array.from(byCourse.values()),
        },
      })
    );

    logger.success("Course preferences updated successfully");
    return { success: true };
  } catch (error) {
    logger.error("Error updating course preferences:", error);
    return { success: false, error: "Failed to update course preferences" };
  }
}
