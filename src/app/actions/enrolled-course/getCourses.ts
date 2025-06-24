"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";
import { unstable_cache } from "next/cache";
import { EnrolledCourse } from "@/app/types/enrolled-course";

async function fetchCourses(userId: string) {
  logger.info(`Fetching users Purschased Courses`);
  try {
    const getCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": `PURCHASE#${userId}`,
      },
    });

    const course = await dynamoDb.send(getCommand);
    return {
      cousre: course.Items as EnrolledCourse[],
    };
  } catch (error) {
    return {
      error: error,
    };
  }
}

export async function getUsersCourses(userId: string) {
  const cacheTag = `users-course-${userId}`;
  return unstable_cache(
    async () => {
      return fetchCourses(userId);
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
