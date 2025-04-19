"use server";
import { dynamoDb, dynamoTableName } from "@/services/dynamoDB";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
export async function verifyMagicLinkToken(token: string) {
  try {
    const verifyCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `MAGICLINK#${token}`,
      },
    });

    const result = await dynamoDb.send(verifyCommand);

    if (!result.Items || result.Items.length === 0) {
      return {
        success: false,
        error: "INVALID_MAGIC_LINK",
        message: "Invalid login link. Please request a new one.",
      };
    }

    const tokenRecord = result.Items[0];

    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenRecord.ttl < currentTime) {
      return {
        success: false,
        error: "MAGIC_LINK_EXPIRED",
        message: "Login link has expired. Please request a new one.",
      };
    }
    if (tokenRecord.used) {
      return {
        success: false,
        error: "MAGIC_LINK_USED",
        message:
          "This login link has already been used. Please request a new one.",
      };
    }
    const userId = tokenRecord.SK.split("#")[1];

    const updateTokenCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `MAGICLINK#${token}`,
        SK: tokenRecord.SK,
      },
      UpdateExpression: "SET used = :used",
      ExpressionAttributeValues: {
        ":used": true,
      },
    });

    await dynamoDb.send(updateTokenCommand);

    const getUserCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "PROFILE",
      },
    });

    const userResult = await dynamoDb.send(getUserCommand);

    if (!userResult.Items || userResult.Items.length === 0) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
        message: "User associated with this login link could not be found.",
      };
    }

    const user = userResult.Items[0];

    return {
      success: true,
      message: "Login successful",
      user,
    };
  } catch (error) {
    console.error("Error verifying magic link token:", error);
    return {
      success: false,
      error: "INTERNAL_ERROR",
      message: "Error processing login. Please try again.",
    };
  }
}
