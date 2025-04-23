"use server";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export interface LessonFormData {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  position?: number;
  duration?: number;
  isPreview?: boolean;
}

export async function createLesson(formData: LessonFormData) {
  try {
    const checkCourseCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${formData.courseId}`,
      },
    });

    const courseResult = await dynamoDb.send(checkCourseCommand);

    if (!courseResult.Item) {
      return {
        success: false,
        message: "Course not found",
        error: "COURSE_NOT_FOUND",
      };
    }

    const lessonId = uuidv4();
    const timestamp = new Date().toISOString();

    const createLessonCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `COURSE#${formData.courseId}`,
        SK: `LESSON#${lessonId}`,
        lessonId: lessonId,
        title: formData.title,
        content: formData.content || "",
        videoUrl: formData.videoUrl || "",
        position: formData.position || 0,
        duration: formData.duration || 0,
        isPreview: formData.isPreview || false,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await dynamoDb.send(createLessonCommand);

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${formData.courseId}`,
      },
      UpdateExpression:
        "SET lessonCount = if_not_exists(lessonCount, :zero) + :one, updatedAt = :timestamp",
      ExpressionAttributeValues: {
        ":zero": 0,
        ":one": 1,
        ":timestamp": timestamp,
      },
    });

    await dynamoDb.send(updateCourseCommand);

    return {
      success: true,
      lessonId: lessonId,
      message: "Lesson created successfully",
    };
  } catch (e) {
    console.error("Error creating lesson:", e);
    return {
      success: false,
      message: "Error creating lesson",
      error: "SERVER_ERROR",
    };
  }
}
