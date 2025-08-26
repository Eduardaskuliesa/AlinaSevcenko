"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import {
  BatchWriteCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteCourse(courseId: string) {
  logger.info("Deleting course");
  try {
    await verifyAdminAccess();
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const course = (await dynamoDb.send(getCommand)).Item as Course;

    if (!course) {
      return {
        success: false,
        error: "COURSE_NOT_FOUND",
      };
    }

    if (course.isPublished) {
      return {
        success: false,
        error: "COURSE_PUBLISHED",
        message: "Course is already published. Cannot delete course.",
      };
    }

    if (course.enrollmentCount > 0) {
      return {
        success: false,
        error: "COURSE_ENROLLED",
        message: "Course has enrolled students. Cannot delete course.",
      };
    }

    const queryCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `COURSE#${courseId}`,
      },
    });

    const lessonItems =
      ((await dynamoDb.send(queryCommand)).Items as Lesson[]) || [];

    const deleteRequests = [
      {
        DeleteRequest: {
          Key: {
            PK: "COURSE",
            SK: `COURSE#${courseId}`,
          },
        },
      },
      ...lessonItems.map((item) => ({
        DeleteRequest: {
          Key: {
            PK: item.PK,
            SK: item.SK,
          },
        },
      })),
    ];

    const chunkedRequests = [];
    for (let i = 0; i < deleteRequests.length; i += 25) {
      chunkedRequests.push(deleteRequests.slice(i, i + 25));
    }

    for (const chunk of chunkedRequests) {
      const batchWriteCommand = new BatchWriteCommand({
        RequestItems: {
          [dynamoTableName as string]: chunk,
        },
      });

      await dynamoDb.send(batchWriteCommand);
    }

    const deleteSlugCommand = new DeleteCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "SLUG",
        SK: `SLUG#${course.slugId}`,
      },
    });

    const deleteSlugResult = await dynamoDb.send(deleteSlugCommand);
    if (deleteSlugResult.$metadata.httpStatusCode === 200) {
      logger.success("Slug deleted successfully");
    }
    logger.success("Course and all associated lessons deleted successfully");

    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag("client-courses");
    revalidateTag(`course-client-${courseId}`);
    revalidateTag("slugs");
    return {
      success: true,
      message: "Course and all associated lessons deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      success: false,
      error: "DELETE_FAILED",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
