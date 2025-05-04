"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Category } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export interface CreateCategoryData {
  title: Category["title"];
  description: Category["description"];
  languge: Category["language"];
}
export async function createCategory(createData: CreateCategoryData) {
  try {
    const categoryId = uuidv4();
    const timestamp = new Date().toISOString();

    const categoryData: Category = {
      PK: "CATEGORY",
      SK: `CATEGORY#${categoryId}`,
      categoryId: categoryId,
      title: createData.title,
      description: createData.description,
      language: createData.languge,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const createCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: categoryData,
    });

    await dynamoDb.send(createCommand);
    logger.success("Category created successfully");
    revalidateTag("categories");

    return {
      success: true,
      categoryId: categoryId,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: "Error creating category",
    };
  }
}
