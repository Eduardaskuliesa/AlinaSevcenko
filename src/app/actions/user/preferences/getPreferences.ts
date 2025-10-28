"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function getPreferences(userId: string) {
  try {
    const command = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PREFERENCE#${userId}`,
        SK: `USER#${userId}`,
      },
      ProjectionExpression: "languge, courseAcess",
    });

    const preferences = await dynamoDb.send(command);
    if (!preferences.Item) {
      logger.error("No preferences found for user:", userId);
      return null;
    }
    return {
      preferences: preferences.Item,
    };
  } catch (error) {
    console.error("Error getting preferences in session:", error);
    return null;
  }
}
