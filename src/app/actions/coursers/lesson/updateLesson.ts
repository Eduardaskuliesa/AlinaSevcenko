"use server";

import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export interface LessonUpdateData {
  lessonId: string;
  title?: string;
  shortDesc?: string;
  isPreview?: boolean;
}

export async function updateLessons(
  courseId: string,
  lessonUpdates: LessonUpdateData[]
) {
   await verifyAdminAccess();
  logger.info(
    `Updating ${lessonUpdates.length} lessons for course ${courseId}`
  );

  try {
    const batches = [];
    for (let i = 0; i < lessonUpdates.length; i += 25) {
      batches.push(lessonUpdates.slice(i, i + 25));
    }

    for (const batch of batches) {
      const transactItems = batch.map((update) => {
        let updateExpression = "SET updatedAt = :updatedAt";
        const expressionAttributeValues: Record<
          string,
          string | boolean | number
        > = {
          ":updatedAt": new Date().toISOString(),
        };

        if (update.title !== undefined) {
          updateExpression += ", title = :title";
          expressionAttributeValues[":title"] = update.title;
        }

        if (update.shortDesc !== undefined) {
          updateExpression += ", shortDesc = :shortDesc";
          expressionAttributeValues[":shortDesc"] = update.shortDesc;
        }

        if (update.isPreview !== undefined) {
          updateExpression += ", isPreview = :isPreview";
          expressionAttributeValues[":isPreview"] = update.isPreview;
        }

        return {
          Update: {
            TableName: dynamoTableName,
            Key: {
              PK: `COURSE#${courseId}`,
              SK: `LESSON#${update.lessonId}`,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
          },
        };
      });

      // Execute the transaction
      const transactWriteCommand = new TransactWriteCommand({
        TransactItems: transactItems,
      });

      await dynamoDb.send(transactWriteCommand);
    }

    revalidateTag(`course-${courseId}`);
    revalidateTag(`lessons-${courseId}`);

    logger.success(`Successfully updated lessons for course ${courseId}`);

    return {
      success: true,
      message: "Lessons updated successfully",
    };
  } catch (error) {
    logger.error("Error updating lesson fields:", error);

    if (error instanceof Error) {
      if (error.name === "TransactionCanceledException") {
        return {
          success: false,
          error: "TRANSACTION_CANCELED",
          message:
            "Transaction was canceled, one or more lessons could not be updated",
        };
      }

      if (error.name === "ResourceNotFoundException") {
        return {
          success: false,
          error: "LESSON_NOT_FOUND",
          message: "One or more lessons not found",
        };
      }
    }

    return {
      success: false,
      error: "UPDATE_FAILED",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
