"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Category } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

export async function fetchCategoires() {
  logger.info("Fetching all client categories from DynamoDB");
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "CATEGORY",
      },
    });

    const categories = await dynamoDb.send(command);

    return {
      success: true,
      categories: (categories.Items as Category[]) || [],
    };
  } catch (error) {
    console.log("Error in getCategories", error);
    return {
      success: false,
      categories: [],
      error: "Failed to fetch categories",
    };
  }
}

export async function getAllCategoriesUP() {
  const cacheTag = `client-categories`;

  const result = await unstable_cache(
    async () => {
      return await fetchCategoires();
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();

  return result;
}
