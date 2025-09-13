"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export interface UpdateLessonStatusData {
  lessonId: Lesson["lessonId"];
  courseId: Course["courseId"];
  status: Lesson["status"];
}

export async function updateLessonStatus(data: UpdateLessonStatusData) {
  try {
    const updateLessonCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${data.courseId}`,
        SK: `LESSON#${data.lessonId}`,
      },
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": data.status,
        ":updatedAt": new Date().toISOString(),
      },

      ConditionExpression: "attribute_exists(PK)",
    });

    await dynamoDb.send(updateLessonCommand);
    logger.success(`Lesson status updated to ${data.status}`);
    revalidateTag(`course-${data.courseId}`);
    revalidateTag(`user-lesson-${data.courseId}`);
    revalidateTag(`client-lessons-${data.courseId}`);
    revalidateTag(`lesson-${data.lessonId}`);
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
