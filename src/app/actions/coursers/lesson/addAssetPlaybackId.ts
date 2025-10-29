"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { mux } from "@/app/services/mux";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export interface AddAssetPlaybackIdData {
  lessonId: Lesson["lessonId"];
  courseId: Course["courseId"];
  assetId: Lesson["assetId"];
  playbackId: Lesson["playbackId"];
  status: Lesson["status"];
}

export async function addAssetPlaybackId(data: AddAssetPlaybackIdData) {
  try {
    const getLessonCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${data.courseId}`,
        SK: `LESSON#${data.lessonId}`,
      },
    });
    const lesson = (await dynamoDb.send(getLessonCommand)).Item as Lesson;

    if (lesson.assetId) {
      mux.video.assets.delete(lesson.assetId);
      logger.info(
        `Deleted old asset with ID: ${lesson.assetId} for lesson ${data.lessonId}`
      );
    }

    const updateLessonCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `COURSE#${data.courseId}`,
        SK: `LESSON#${data.lessonId}`,
      },
      UpdateExpression:
        "SET assetId = :assetId, playbackId = :playbackId, #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": data.status,
        ":assetId": data.assetId,
        ":playbackId": data.playbackId,
        ":updatedAt": new Date().toISOString(),
      },

      ConditionExpression: "attribute_exists(PK)",
    });

    await dynamoDb.send(updateLessonCommand);

    revalidateTag(`course-${data.courseId}`)
    revalidateTag(`admin-lesson-${data.courseId}`);
    revalidateTag(`course-client-${data.courseId}`);
    revalidateTag(`user-lesson-${data.courseId}`);
    revalidateTag(`learning-data-${data.courseId}`);
    revalidateTag(`client-lessons-${data.courseId}`);
    revalidateTag(`courses`);


    const path = `admin/courses/${data.courseId}/lessons`;
    revalidatePath(path);
    logger.success(
      `Asset ID: ${data.assetId} and Playback ID: ${data.playbackId} added to lesson ${data.lessonId}`
    );
    return {
      success: true,
      assetId: data.assetId,
      playbackId: data.playbackId,
    };
  } catch (error) {
    logger.error("Error adding asset and playback ID:", error);
    return {
      success: false,
      error: "Error adding asset and playback ID",
    };
  }
}
