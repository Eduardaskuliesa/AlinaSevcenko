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

    return {
      success: true,
      message: "Token verified successfully",
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
