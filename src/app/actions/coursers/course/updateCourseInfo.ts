"use server";
import { Course, CourseUpdateInfoData } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";
import { logger } from "@/app/utils/logger";

export async function updateCourseInfo(
  courseData: CourseUpdateInfoData,
  courseId: Course["courseId"]
) {
  try {
    if (!courseData.courseTitle || !courseData.courseTitle.trim()) {
      return {
        error: "TITLE_EMPTY",
      };
    }

    const timestamp = new Date().toISOString();
    const DEFAULT_PLACEHOLDER = "/placeholder.svg";

    const simplifiedCategories = courseData.assignedCategories.map(
      (category) => ({
        categoryId: category.categoryId,
        title: category.title,
        language: category.language,
      })
    );

    const updateFieldsCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET title = :title,
            shortDescription = :shortDescription,
            description = :description,
            thumbnailImage = :thumbnailImage,
            categories = :categories,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":title": courseData.courseTitle,
        ":shortDescription": courseData.shortDescription,
        ":description": courseData.fullDescription,
        ":thumbnailImage": courseData.thumbnailSrc,
        ":categories": simplifiedCategories,
        ":updatedAt": timestamp,
      },
      ReturnValues: "ALL_NEW",
    });

    const descriptionComplete = Boolean(courseData.fullDescription?.trim());
    const thumbnailComplete =
      courseData.thumbnailSrc &&
      courseData.thumbnailSrc.trim() &&
      courseData.thumbnailSrc !== DEFAULT_PLACEHOLDER;
    const categoryComplete = courseData.assignedCategories.length > 0;

    const updateStatusCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET completionStatus.description = :descComplete,
            completionStatus.thumbnail = :thumbnailComplete,
            completionStatus.category = :categoryComplete
      `,
      ExpressionAttributeValues: {
        ":descComplete": descriptionComplete,
        ":thumbnailComplete": thumbnailComplete,
        ":categoryComplete": categoryComplete,
      },
      ReturnValues: "UPDATED_NEW",
    });

    const [fieldsResult, statusResult] = await Promise.all([
      dynamoDb.send(updateFieldsCommand),
      dynamoDb.send(updateStatusCommand),
    ]);
    logger.success("Course info updated successfully");
    revalidateTag(`course-${courseId}`);

    return {
      fieldsUpdate: fieldsResult,
      statusUpdate: statusResult,
    };
  } catch (error) {
    console.error("Error updating course info:", error);
    return {
      error: error,
    };
  }
}
