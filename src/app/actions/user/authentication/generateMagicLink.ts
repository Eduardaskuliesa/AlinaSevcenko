"use server";
import { v4 as uuidv4 } from "uuid";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function generateMagicLinkToken(email: string) {
  try {
    const findUserCommand = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :email AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":email": email,
        ":sk": "EMAIL",
      },
    });

    const userResult = await dynamoDb.send(findUserCommand);

    if (!userResult.Items || userResult.Items.length === 0) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
        message: "User with this email does not exist.",
      };
    }

    const user = userResult.Items[0];
    const userId = user.userId;

    const magicLinkToken = uuidv4();

    const expirationTime = Math.floor(Date.now() / 1000) + 15 * 60;

    const storeTokenCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `MAGICLINK#${magicLinkToken}`,
        SK: `USER#${userId}`,
        email: email,
        ttl: expirationTime,
        createdAt: new Date().toISOString(),
        used: false,
      },
    });

    await dynamoDb.send(storeTokenCommand);

    return {
      success: true,
      message: "Magic link token generated successfully",
      token: magicLinkToken,
    };
  } catch (error) {
    console.error("Error generating magic link token:", error);
    return {
      success: false,
      error: "INTERNAL_ERROR",
      message: "Unable to generate login link. Please try again.",
    };
  }
}
