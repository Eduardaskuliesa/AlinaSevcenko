"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateLessonOrder(
  courseId: string,
  lessonOrder: Array<{ lessonId: string; sort: number }>
) {
  try {
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
    revalidateTag(`course-${courseId}`);
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
