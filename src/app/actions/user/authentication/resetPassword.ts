"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";

export async function resetPassword(token: string, password: string) {
  try {
    if (typeof token !== "string" || !token) {
      return { success: false, message: "Invalid token." };
    }
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      !/[A-Z]/.test(password)
    ) {
      return {
        success: false,
        message:
          "Password must be at least 8 characters and contain an uppercase letter.",
      };
    }

    const tokenResult = await dynamoDb.send(
      new QueryCommand({
        TableName: dynamoTableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: { ":pk": `MAGICLINK#${token}` },
      })
    );

    const tokenRecord = tokenResult.Items?.[0];
    if (!tokenRecord) {
      return { success: false, message: "Invalid token." };
    }
    if (tokenRecord.ttl < Math.floor(Date.now() / 1000)) {
      return { success: false, message: "Reset link has expired." };
    }

    try {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: dynamoTableName,
          Key: { PK: tokenRecord.PK, SK: tokenRecord.SK },
          UpdateExpression: "SET used = :true",
          ConditionExpression: "used = :false",
          ExpressionAttributeValues: { ":true": true, ":false": false },
        })
      );
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return { success: false, message: "Reset link has already been used." };
      }
      throw error;
    }

    const userId = (tokenRecord.SK as string).replace("USER#", "");
    const hashedPassword = await bcrypt.hash(password, 10);

    await dynamoDb.send(
      new UpdateCommand({
        TableName: dynamoTableName,
        Key: { PK: "PROFILE", SK: `USER#${userId}` },
        UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
        ConditionExpression: "attribute_exists(PK)",
        ExpressionAttributeValues: {
          ":password": hashedPassword,
          ":updatedAt": new Date().toISOString(),
        },
      })
    );

    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An error occurred while resetting your password.",
    };
  }
}
