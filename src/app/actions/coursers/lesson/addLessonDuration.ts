"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export interface AddDurationData {
  lessonId: Lesson["lessonId"];
  courseId: Course["courseId"];
  duration: Lesson["duration"];
  status: Lesson["status"];
}

export async function addLessonDuration(data: AddDurationData) {
  console.log("CourseID:", data.courseId);
  try {
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

    await dynamoDb.send(updateLessonCommand);

    revalidateTag(`course-${data.courseId}`);
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
