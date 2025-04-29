"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
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
    const getCourseCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const courseResult = await dynamoDb.send(getCourseCommand);

    if (!courseResult.Item) {
      return {
        success: false,
        message: "Course not found",
        error: "COURSE_NOT_FOUND",
      };
    }

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

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression:
        "SET lessonCount = :lessonCount, lessonOrder = :lessonOrder, updatedAt = :timestamp, completionStatus.lessons = :lessonComplete",
      ExpressionAttributeValues: {
        ":lessonCount": currentLessonCount - 1,
        ":lessonOrder": updatedLessonOrder,
        ":timestamp": timestamp,
        ":lessonComplete": hasRemainingLessons,
      },
    });

    await dynamoDb.send(updateCourseCommand);

    revalidateTag(`course-${courseId}`);
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
