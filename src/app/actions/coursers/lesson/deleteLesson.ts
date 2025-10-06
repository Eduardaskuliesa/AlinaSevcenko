"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { mux } from "@/app/services/mux";
import { Course, Lesson } from "@/app/types/course";
import {
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { revalidateTag } from "next/cache";

export async function deleteLesson(
  courseId: Course["courseId"],
  lessonId: Lesson["lessonId"]
) {
  try {
    await verifyAdminAccess();
    const getCourseCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const courseResult = await dynamoDb.send(getCourseCommand);

    console.log("courseResult", courseResult.Item as Course);

    if (!courseResult.Item) {
      return {
        success: false,
        message: "Course not found",
        error: "COURSE_NOT_FOUND",
      };
    }

    if (courseResult.Item.isPublished) {
      return {
        success: false,
        message: "Course is already published. Cannot update course info.",
        error: "COURSE_PUBLISHED",
      };
    }

    const getLessonCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${courseId}`,
        SK: `LESSON#${lessonId}`,
      },
    });

    const lessonResult = await dynamoDb.send(getLessonCommand);
    const lessonDuration = lessonResult.Item?.duration || 0;
    console.log("lessonResult", lessonResult.Item as Lesson);
    const course = courseResult.Item;
    const currentLessonCount = course.lessonCount || 0;
    const currentLessonOrder = course.lessonOrder || [];

    const updatedLessonOrder = currentLessonOrder.filter(
      (lesson: { lessonId: string }) => lesson.lessonId !== lessonId
    );

    const deleteCommand = new DeleteCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${courseId}`,
        SK: `LESSON#${lessonId}`,
      },
    });

    await dynamoDb.send(deleteCommand);

    const timestamp = new Date().toISOString();
    const hasRemainingLessons = updatedLessonOrder.length > 0;

    const newLessonCount = Math.max(0, currentLessonCount - 1);

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression:
        "SET lessonCount = :lessonCount, lessonOrder = :lessonOrder, updatedAt = :timestamp, completionStatus.lessons = :lessonComplete ADD #dur :duration",
      ExpressionAttributeNames: {
        "#dur": "duration",
      },
      ExpressionAttributeValues: {
        ":lessonCount": newLessonCount,
        ":lessonOrder": updatedLessonOrder,
        ":timestamp": timestamp,
        ":lessonComplete": hasRemainingLessons,
        ":duration": -lessonDuration,
      },
    });

    if (lessonResult.Item?.assetId) {
      mux.video.assets.delete(lessonResult.Item.assetId);
    }

    await dynamoDb.send(updateCourseCommand);

    revalidateTag(`course-${courseId}`);
    revalidateTag(`user-lesson-${courseId}`);
    revalidateTag(`client-lessons-${courseId}`);
    revalidateTag(`courses`);
    return {
      success: true,
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return {
      success: false,
      message: "Error deleting lesson",
      error: "SERVER_ERROR",
    };
  }
}
