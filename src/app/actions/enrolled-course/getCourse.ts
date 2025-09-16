"use server";
import { Course } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";
import { unstable_cache } from "next/cache";
import { EnrolledCourse } from "@/app/types/enrolled-course";

export async function fetchCourse(
  courseId: Course["courseId"],
  userId: string
) {
  logger.info(`Fetching course ${courseId}`);
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
    });

    const course = await dynamoDb.send(getCommand);
    
    return {
      cousre: course.Item as EnrolledCourse,
    };
  } catch (error) {
    logger.error(`Error fetching course ${courseId}`, error);
    return {
      error: error,
    };
  }
}

export async function getCourse(courseId: EnrolledCourse["courseId"], userId: string) {
  const cacheTag = `enrolled-course-${userId}`;
  return unstable_cache(
    async () => {
      return fetchCourse(courseId, userId);
    },
    [cacheTag],
    { revalidate: 180, tags: [cacheTag] }
  )();
}
