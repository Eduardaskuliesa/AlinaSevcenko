"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface CoursePreferences {
  courseId: string;
  expiresAt: string | "lifetime";
}

export async function updateCoursePreferences(
  userId: string,
  coursePereferences: CoursePreferences[]
) {
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PREFERENCE#${userId}`,
        SK: `USER#${userId}`,
      },
    });

    const existingPreferences = await dynamoDb.send(getCommand);
    const existingCourses = existingPreferences.Item?.courseAcess || [];

    const mergedCourses = existingCourses.map(
      (existingCourse: CoursePreferences) => {
        const newCourse = coursePereferences.find(
          (newCourse) => newCourse.courseId === existingCourse.courseId
        );

        if (newCourse) {
          if (newCourse.expiresAt === "lifetime") {
            return { ...existingCourse, expiresAt: "lifetime" };
          }

          if (existingCourse.expiresAt === "lifetime") {
            return existingCourse;
          }

          const existingDate = new Date(existingCourse.expiresAt);
          const newDate = new Date(newCourse.expiresAt);
          const extensionTime = newDate.getTime() - Date.now();
          const extendedDate = new Date(existingDate.getTime() + extensionTime);

          return { ...existingCourse, expiresAt: extendedDate.toISOString() };
        }

        return existingCourse;
      }
    );

    const newCourseIds = coursePereferences.filter(
      (newCourse: CoursePreferences) =>
        !existingCourses.some(
          (existing: CoursePreferences) =>
            existing.courseId === newCourse.courseId
        )
    );

    const finalCourses = [...mergedCourses, ...newCourseIds];

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PREFERENCE#${userId}`,
        SK: `USER#${userId}`,
      },
      UpdateExpression: "SET courseAcess = :courseAcess",
      ExpressionAttributeValues: {
        ":courseAcess": finalCourses,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(updateCommand);


    if (response.$metadata.httpStatusCode === 200) {
      logger.success("Course preferences updated successfully");
      return {
        success: true,
        message: "Course preferences updated successfully",
      };
    }
  } catch (error) {
    console.error("Error updating course preferences:", error);
    return {
      success: false,
      error: "Failed to update course preferences",
    };
  }
}
