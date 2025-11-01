"use server";

import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { createCourseSeo } from "./createCourseSeo";
import { revalidatePath, revalidateTag } from "next/cache";

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
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE_SEO",
        SK: `COURSE_SEO#${courseId}#${locale}`,
      },
    });

    const existingItem = await dynamoDb.send(getCommand);

    if (!existingItem.Item) {
      logger.info("Course SEO not found, creating new entry.");
      return await createCourseSeo({
        courseId,
        locale,
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
      });
    }

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
      return { success: true };
    }

    updateExpressions.push("updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const updateExpression = `SET ${updateExpressions.join(", ")}`;

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE_SEO",
        SK: `COURSE_SEO#${courseId}#${locale}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const result = await dynamoDb.send(updateCommand);

    if (result) {
      logger.success("Course SEO data updated successfully.");
      revalidateTag(`course-seo-${courseId}-${locale}`);
      revalidatePath(`/${locale}/main-courses/${existingItem.Item.slug}`);
      revalidatePath(`/${locale}/courses/${existingItem.Item.slug}`);
      return { success: true };
    }
  } catch (error) {
    console.error("Failed to update course SEO data:", error);
    return { success: false, error: "Failed to update course SEO data" };
  }
}
