"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function createPreferences(userId: string, languge: string) {
  try {
    const userPreferences = {
      PK: `PREFERENCE#${userId}`,
      SK: `USER#${userId}`,
      languge: languge,
      userId: userId,
      courseAcess: [],
    };

    const createCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: userPreferences,
    });

    const response = await dynamoDb.send(createCommand);

    if (response.$metadata.httpStatusCode === 200) {
      logger.success("Preferences created successfully");
      return {
        success: true,
        message: "Preferences created successfully",
        preferences: userPreferences,
      };
    }
  } catch (error) {
    console.error("Error creating preferences:", error);
    return {
      success: false,
      error: "Failed to create preferences",
    };
  }
}
