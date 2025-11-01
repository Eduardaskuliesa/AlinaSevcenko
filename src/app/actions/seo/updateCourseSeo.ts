"use server";

import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

interface UpdateCourseSeoData {
  courseId: string;
  locale: string;
  metaTitle?: string;
  metaDescription?: string;
}

export async function updateCourseSeo({
  courseId,
  locale,
  metaTitle,
  metaDescription,
}: UpdateCourseSeoData) {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, string> = {};

    if (metaTitle !== undefined) {
      updateExpressions.push("metaTitle = :metaTitle");
      expressionAttributeValues[":metaTitle"] = metaTitle;
    }

    if (metaDescription !== undefined) {
      updateExpressions.push("metaDescription = :metaDescription");
      expressionAttributeValues[":metaDescription"] = metaDescription;
    }
    if (updateExpressions.length === 0) {
      logger.info("No SEO data provided to update.");
      return;
    }

    const updateExpression = `SET ${updateExpressions.join(",")}`;

    const command = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "SEO_COURSE",
        SK: `SEO_COURSE#${courseId}#${locale}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const result = await dynamoDb.send(command);

    if (result) {
      logger.success("Course SEO data updated successfully.");
      return { success: true };
    }
  } catch (error) {
    console.error("Failed to update course SEO data:", error);
  }
}
