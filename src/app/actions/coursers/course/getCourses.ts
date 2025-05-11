"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchCourses() {
  logger.info("Fetching courses from DynamoDB");
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": "COURSE",
      },
    });

    const courses = await dynamoDb.send(command);

    return {
      success: true,
      courses: (courses.Items as Course[]) || [],
    };
  } catch (error) {
    console.log("Error in getCourses", error);
    return {
      success: false,
      courses: [],
      error: "Failed to fetch courses",
    };
  }
}

export async function getCourses() {
  await verifyAdminAccess();
  const cacheTag = `courses`;
  return unstable_cache(
    async () => {
      const result = await fetchCourses();

      return result;
    },
    [cacheTag],
    { revalidate: 180, tags: [cacheTag] }
  )();
}
