"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function getUser(userId: string) {
  try {
    const command = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PROFILE`,
        SK: `USER#${userId}`,
      },
    });

    const result = await dynamoDb.send(command);

    if (!result.Item) {
      return null;
    }

    return result.Item;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
