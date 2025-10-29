"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { PurschaseCourseData } from "./createEnrolledCourse";

export async function updateEnrolledCourse(data: PurschaseCourseData) {
  try {
    logger.info(
      `Updating enrolled course for user ${data.userId}, course ${data.courseId}`
    );

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${data.userId}`,
        SK: `COURSE#${data.courseId}`,
      },
      UpdateExpression:
        "SET purchaseId = :purchaseId, paymentId = :paymentId, expiresAt = :expiresAt, accessPlanName = :accessPlanName, accessPlanDuration = :accessPlanDuration, pricePaid = :pricePaid, purchaseDate = :purchaseDate, #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":purchaseId": data.purchaseId,
        ":paymentId": data.paymentId,
        ":expiresAt": data.expiresAt,
        ":accessPlanName": data.accessPlanName,
        ":accessPlanDuration": data.accessPlanDuration,
        ":pricePaid": data.pricePaid,
        ":purchaseDate": data.purchaseDate,
        ":status": data.status,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCommand);

    logger.success(
      `Successfully updated enrolled course ${data.courseId} for user ${data.userId}`
    );

    return { success: true };
  } catch (error) {
    logger.error(
      `Error updating enrolled course for user ${data.userId}, course ${data.courseId}`,
      error
    );
    return { success: false, error };
  }
}
