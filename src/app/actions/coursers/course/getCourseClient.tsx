"use server";
import { Course } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";
import { unstable_cache } from "next/cache";

export async function fetchCourse(courseId: Course["courseId"]) {
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
      course: course.Item as Course,
    };
  } catch (error) {
    logger.error(`Error fetching course ${courseId}`, error);
    return {
      error: error,
    };
  }
}

export async function getCourseClient(courseId: Course["courseId"]) {
  const cacheTag = `course-client-${courseId}`;
  return unstable_cache(
    async () => {
      return fetchCourse(courseId);
    },
    [cacheTag],
    { revalidate: 180, tags: [cacheTag] }
  )();
}
