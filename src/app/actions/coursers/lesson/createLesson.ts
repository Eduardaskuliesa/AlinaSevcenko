"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createLesson(courseId: Course["courseId"]) {
  try {
    await verifyAdminAccess();
    const checkCourseCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
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

    if (courseResult.Item.isPublished) {
      return {
        success: false,
        message: "Course is already published. Cannot update course info.",
        error: "COURSE_PUBLISHED",
      };
    }

    const course = courseResult.Item;
    const lessonId = uuidv4();
    const timestamp = new Date().toISOString();
    const currentLessonCount = course.lessonCount || 0;

    const createLessonCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `COURSE#${courseId}`,
        SK: `LESSON#${lessonId}`,
        lessonId: lessonId,
        title: "New Lesson",
        shortDesc: "",
        videoUrl: "",
        duration: 0,
        assetId: null,
        playbackId: null,
        status: "waiting",
        isPreview: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await dynamoDb.send(createLessonCommand);

    const currentLessonOrder = course.lessonOrder || [];

    console.log("currentLessonOrder", currentLessonOrder);

    const newLessonOrder = [
      ...currentLessonOrder,
      {
        lessonId: lessonId,
        sort: currentLessonCount,
        isPreview: false,
      },
    ];

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression:
        "SET lessonCount = :lessonCount, lessonOrder = :lessonOrder, updatedAt = :timestamp, completionStatus.lessons = :lessonComplete",
      ExpressionAttributeValues: {
        ":lessonComplete": true,
        ":lessonCount": currentLessonCount + 1,
        ":lessonOrder": newLessonOrder,
        ":timestamp": timestamp,
      },
    });

    await dynamoDb.send(updateCourseCommand);

    revalidateTag(`course-${courseId}`);
    revalidateTag(`user-lesson-${courseId}`);
    revalidateTag(`client-lessons-${courseId}`);
    revalidateTag(`course-client-${courseId}`);
    revalidateTag(`courses`);
    revalidatePath(`/lt/courses/${course.slug}`);
    revalidatePath(`/ru/courses/${course.slug}`);

    return {
      success: true,
      lessonId,
      title: "New Lesson",
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
