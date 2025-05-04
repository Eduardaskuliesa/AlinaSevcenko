"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteCategory(categoryId: string) {
  try {
    const command = new DeleteCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "CATEGORY",
        SK: `CATEGORY#${categoryId}`,
      },
    });

    await dynamoDb.send(command);
    revalidateTag("categories");
    logger.success("Category deleted successfully");
    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    logger.error("Error deleting category", { error, categoryId });
    return {
      success: false,
      error: "Failed to delete category",
    };
  }
}
