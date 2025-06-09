"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export interface AddDurationData {
  lessonId: Lesson["lessonId"];
  courseId: Course["courseId"];
  duration: Lesson["duration"];
  status: Lesson["status"];
}

export async function addLessonDuration(data: AddDurationData) {
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${data.courseId}`,
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
        message: "Course is already published. Cannot update course info.",
      };
    }

    const updateLessonCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${data.courseId}`,
        SK: `LESSON#${data.lessonId}`,
      },
      UpdateExpression:
        "SET #duration = :duration, #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
        "#duration": "duration",
      },
      ExpressionAttributeValues: {
        ":status": data.status,
        ":duration": data.duration,
        ":updatedAt": new Date().toISOString(),
      },

      ConditionExpression: "attribute_exists(PK)",
    });

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${data.courseId}`,
      },
      UpdateExpression: "SET updatedAt = :updatedAt ADD #duration :duration",
      ExpressionAttributeNames: {
        "#duration": "duration",
      },
      ExpressionAttributeValues: {
        ":updatedAt": new Date().toISOString(),
        ":duration": data.duration,
      },
      ReturnValues: "UPDATED_NEW",
    });
    await Promise.all([
      dynamoDb.send(updateLessonCommand),
      dynamoDb.send(updateCourseCommand),
    ]);

    revalidateTag(`course-${data.courseId}`);
    revalidateTag(`admin-lesson-${data.courseId}`);
    revalidateTag(`user-lesson-${data.courseId}`);
    revalidateTag(`courses`);
    const path = `admin/courses/${data.courseId}/lessons`;
    revalidatePath(path);

    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error adding asset and playback ID:", error);
    return {
      success: false,
      error: "Error adding asset and playback ID",
    };
  }
}
