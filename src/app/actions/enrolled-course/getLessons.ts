"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchLessons(courseId: Course["courseId"]) {
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

    const filteredLessons = (response.Items as Lesson[] | undefined)?.filter(
      (item: Lesson) => item.status === "ready"
    );
    return filteredLessons ?? [];
  } catch (error) {
    logger.error(`Error fetching lessons for course ${courseId}`, error);
  }
}

export async function getLessons(courseId: Course["courseId"]) {
  const cacheTag = `user-lesson-${courseId}`;
  const revalidateTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  return unstable_cache(
    async () => {
      return fetchLessons(courseId);
    },
    [cacheTag],
    { revalidate: revalidateTime, tags: [cacheTag] }
  )();
}
