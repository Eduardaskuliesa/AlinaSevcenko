import "server-only";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function fetchPreferences(userId: string) {
  try {
    const preferences = await dynamoDb.send(
      new GetCommand({
        TableName: dynamoTableName,
        Key: { PK: `PREFERENCE#${userId}`, SK: `USER#${userId}` },
        ProjectionExpression: "languge, courseAcess",
      })
    );
    if (!preferences.Item) {
      logger.error("No preferences found for user:", userId);
      return null;
    }
    return { preferences: preferences.Item };
  } catch (error) {
    console.error("Error getting preferences:", error);
    return null;
  }
}
