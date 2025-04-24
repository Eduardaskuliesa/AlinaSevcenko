"use server";
import { Course, CourseUpdateInfoData } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";
// We need to implement course category queryn and fetching.
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
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":title": courseData.courseTitle,
        ":shortDescription": courseData.shortDescription,
        ":description": courseData.fullDescription,
        ":thumbnailImage": courseData.thumbnailSrc,
        ":updatedAt": timestamp,
      },
      ReturnValues: "UPDATED_NEW",
    });

    const descriptionComplete = Boolean(courseData.fullDescription?.trim());
    const thumbnailComplete =
      courseData.thumbnailSrc &&
      courseData.thumbnailSrc.trim() &&
      courseData.thumbnailSrc !== DEFAULT_PLACEHOLDER;

    const updateStatusCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET completionStatus.description = :descComplete,
            completionStatus.thumbnail = :thumbnailComplete
      `,
      ExpressionAttributeValues: {
        ":descComplete": descriptionComplete,
        ":thumbnailComplete": thumbnailComplete,
      },
      ReturnValues: "UPDATED_NEW",
    });
    const [fieldsResult, statusResult] = await Promise.all([
      dynamoDb.send(updateFieldsCommand),
      dynamoDb.send(updateStatusCommand),
    ]);

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
