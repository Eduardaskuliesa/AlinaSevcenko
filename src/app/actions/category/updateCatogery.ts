"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export interface UpdateCategoryData {
  title?: string;
  description?: string;
  language?: string;
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryData
) {
  try {
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    if (data.title !== undefined) {
      updateExpressionParts.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = data.title;
    }

    if (data.description !== undefined) {
      updateExpressionParts.push("#description = :description");
      expressionAttributeNames["#description"] = "description";
      expressionAttributeValues[":description"] = data.description;
    }

    if (data.language !== undefined) {
      updateExpressionParts.push("#language = :language");
      expressionAttributeNames["#language"] = "language";
      expressionAttributeValues[":language"] = data.language;
    }

    updateExpressionParts.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const updateExpression = `SET ${updateExpressionParts.join(", ")}`;

    const command = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "CATEGORY",
        SK: `CATEGORY#${categoryId}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(command);

    revalidateTag("categories");
    logger.success("Category updated successfully");
    return {
      success: true,
      category: result.Attributes,
      message: "Category updated successfully",
    };
  } catch (error) {
    logger.error("Error updating category", { error, categoryId, data });
    return {
      success: false,
      error: "Failed to update category",
    };
  }
}
