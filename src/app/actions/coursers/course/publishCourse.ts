"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course } from "@/app/types/course";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export async function publishCourse(courseId: string, isPublished: boolean) {
  await verifyAdminAccess();
  try {
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
        error: `COURSE_NOT_FOUND`,
      };
    }

    const canBePublsihed = Object.values(course.completionStatus).every(
      (status) => status === true
    );

    if (!canBePublsihed && isPublished) {
      return {
        success: false,
        error: `COURSE_NOT_COMPLETED`,
        message: "Course cannot be published until all modules are completed",
      };
    }

    const timestamp = new Date().toISOString();
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
                SET isPublished = :isPublished,
                    updatedAt = :updatedAt
            `,
      ExpressionAttributeValues: {
        ":isPublished": isPublished,
        ":updatedAt": timestamp,
      },
    });

    await dynamoDb.send(updateCommand);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag(`course-client-${courseId}`);
    revalidateTag("client-courses");
    revalidatePath(`/lt/courses/${course.slug}`);
    revalidatePath(`/ru/courses/${course.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Error publishing course ${courseId}`, error);
    return {
      error: error,
    };
  }
}
