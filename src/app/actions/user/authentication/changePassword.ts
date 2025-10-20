"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  userId: string;
}

export async function changePassword(data: ChangePasswordData) {
  try {
    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    if (!/[A-Z]/.test(data.newPassword)) {
      return {
        success: false,
        error: "Password must contain at least one uppercase letter",
      };
    }

    const getUserCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PROFILE`,
        SK: `USER#${data.userId}`,
      },
    });

    const result = await dynamoDb.send(getUserCommand);

    if (!result.Item) {
      return {
        success: false,
        error: "User not found",
      };
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      result.Item.password
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PROFILE`,
        SK: `USER#${data.userId}`,
      },
      UpdateExpression: "SET password = :password, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":password": hashedPassword,
        ":updatedAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCommand);
    logger.info(`Password changed for user ${data.userId}`);
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: "Failed to change password",
    };
  }
}
