"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";
import { fetchLessons } from "../lesson/getClientLessons";
import { FilteredCourse } from "@/app/types/course";

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
        "courseId, shortDescription, title, thumbnailImage, #duration, categories, #language, accessPlans, slug, sort",
      ExpressionAttributeNames: {
        "#language": "language",
        "#duration": "duration",
      },
    });

    const courses = await dynamoDb.send(command);

    const coursesWithLessonCount = await Promise.all(
      courses?.Items?.map(async (course) => {
        const lessons = await fetchLessons(course.courseId);
        const readyLessonCount =
          lessons?.filter((lesson) => lesson.status === "ready").length || 0;

        return {
          ...course,
          readyLessonCount,
        };
      }) || []
    );

    return {
      success: true,
      courses: coursesWithLessonCount as FilteredCourse[],
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
