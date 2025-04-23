"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

export async function resetPassword(token: string, password: string) {
  try {
    const tokenCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `MAGICLINK#${token}`,
      },
    });

    const tokenResult = await dynamoDb.send(tokenCommand);

    if (!tokenResult.Items || tokenResult.Items.length === 0) {
      return {
        success: false,
        message: "Invalid token.",
      };
    }

    const tokenRecord = tokenResult.Items[0];
    const userEmail = tokenRecord.email;

    const findUserCommand = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :email AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":email": userEmail,
        ":sk": "EMAIL",
      },
    });

    const userResult = await dynamoDb.send(findUserCommand);

    if (!userResult.Items || userResult.Items.length === 0) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const user = userResult.Items[0];
    const userId = user.PK.replace("USER#", "");

    const hashedPassword = bcrypt.hashSync(password, 10);

    const updateUserCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `USER#${userId}`,
        SK: "PROFILE",
      },
      UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":password": hashedPassword,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateUserCommand);
    return {
      success: true,
      message: "Password reset successfully.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An error occurred while resetting your password.",
    };
  }
}
