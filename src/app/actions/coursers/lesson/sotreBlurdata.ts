"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "@/app/utils/logger";
import { muxActions } from "@/app/actions/mux";
import { revalidateTag } from "next/cache";

interface BlurPlaceholderData {
  blurDataURL: string;
  aspectRatio: number;
}

export async function storeBlurPlaceholder(
  lessonId: string,
  courseId: string,
  playbackId: string
): Promise<BlurPlaceholderData | null> {
  try {
    const placeholder = await muxActions.getPlaceholder(playbackId);

    if (!placeholder) {
      logger.error(
        `Failed to generate placeholder for lesson ${lessonId} with playback ID ${playbackId}`
      );
      return null;
    }
    await dynamoDb.send(
      new UpdateCommand({
        TableName: dynamoTableName,
        Key: {
          PK: `COURSE#${courseId}`,
          SK: `LESSON#${lessonId}`,
        },
        UpdateExpression:
          "SET blurPlaceholder = :blurPlaceholder, blurAspectRatio = :aspectRatio, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":blurPlaceholder": placeholder.blurDataURL,
          ":aspectRatio": placeholder.aspectRatio,
          ":updatedAt": new Date().toISOString(),
        },
      })
    );

    logger.success(
      `Successfully stored blur placeholder for lesson ${lessonId}`
    );

    revalidateTag(`course-${courseId}`);
    revalidateTag(`user-lesson-${courseId}`);
    revalidateTag(`client-lessons-${courseId}`);
    revalidateTag(`courses`);
    

    return placeholder;
  } catch (error) {
    logger.error(`Error storing blur placeholder: ${error}`);
    if (error instanceof Error) {
      logger.error(error.stack || "No stack trace available");
    }
    return null;
  }
}
