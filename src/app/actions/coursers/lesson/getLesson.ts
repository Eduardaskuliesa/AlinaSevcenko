"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchLesson(
  courseId: Course["courseId"],
  lessonId: Lesson["lessonId"]
) {
  try {
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

export async function getLesson(
  courseId: Course["courseId"],
  lessonId: Lesson["lessonId"]
) {
  const cacheTag = `lesson-${lessonId}`;
  return unstable_cache(
    async () => {
      return fetchLesson(courseId, lessonId);
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
