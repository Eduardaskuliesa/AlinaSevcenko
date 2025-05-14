"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { FilteredCourse } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchCourses() {
  logger.info("Fetching all client courses from DynamoDB");
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :PK",
      FilterExpression: "isPublished = :published",
      ExpressionAttributeValues: {
        ":PK": "COURSE",
        ":published": true,
      },
      ProjectionExpression:
        "courseId, shortDescription, title, thumbnailImage, lessonCount, #duration, categories, #language, accessPlans",
      ExpressionAttributeNames: {
        "#language": "language",
        "#duration": "duration",
      },
    });

    const courses = await dynamoDb.send(command);
    return {
      success: true,
      courses: (courses.Items as FilteredCourse[]) || [],
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

export async function getAllCoursesUP() {
  const cacheTag = `client-courses`;
  return unstable_cache(
    async () => {
      const result = await fetchCourses();
      return result;
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
