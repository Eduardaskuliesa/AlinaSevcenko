"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

export async function fetchLessons(courseId: Course["courseId"]) {
  try {
    logger.info(`Fetching client lessons for course ${courseId}`);
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
    logger.error(
      `Error   fetching client lessons for course ${courseId}`,
      error
    );
  }
}

export async function getClientLessons(courseId: Course["courseId"]) {
  const cacheTag = `client-lessons-${courseId}`;
  return unstable_cache(
    async () => {
      return fetchLessons(courseId);
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
