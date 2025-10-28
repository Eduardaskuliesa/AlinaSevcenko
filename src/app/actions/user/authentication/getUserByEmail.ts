"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getUserByEmail(email: string) {
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :email AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":email": email,
        ":sk": "EMAIL",
      },
    });

    const result = await dynamoDb.send(command);
    if (!result.Items || result.Items.length === 0) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
      };
    }

    return {
      success: true,
      user: result.Items[0],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    };
  }
}
