"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateLessonOrder(
  courseId: Course["courseId"],
  lessonOrder: Array<{ lessonId: string; sort: number }>
) {
  try {
    console.log(
      "updateLessonOrder INPUT:",
      JSON.stringify(lessonOrder, null, 2)
    );
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
        message: "Course is already published. Cannot update course info.",
      };
    }
    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression:
        "SET lessonOrder = :lessonOrder, updatedAt = :timestamp",
      ExpressionAttributeValues: {
        ":lessonOrder": lessonOrder,
        ":timestamp": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCourseCommand);
    revalidatePath(`/courses`);
    revalidateTag(`client-lessons-${courseId}`);
    revalidateTag(`learning-data-${courseId}`);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`course-client-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag("client-courses");
    revalidateTag(`user-lesson-${courseId}`);
    revalidatePath(`/lt/courses/${course.slug}`);
    revalidatePath(`/ru/courses/${course.slug}`);

    return {
      success: true,
      message: "Lesson order updated successfully",
    };
  } catch (e) {
    console.error("Error updating lesson order:", e);
    return {
      success: false,
      message: "Error updating lesson order",
      error: "SERVER_ERROR",
    };
  }
}
