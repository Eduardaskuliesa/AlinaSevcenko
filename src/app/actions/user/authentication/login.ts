"use server";

import { dynamoDb, dynamoTableName } from "@/services/dynamoDB";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

export interface LoginFormData {
  email: string;
  password: string;
}

export async function login(formData: LoginFormData) {
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :email AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":email": formData.email,
        ":sk": "EMAIL",
      },
    });
    const userResult = await dynamoDb.send(command);

    if (!userResult.Items || userResult.Items.length === 0) {
      return {
        success: false,
        error: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      };
    }

    const user = userResult.Items[0];

    const isPasswordValid = await bcrypt.compare(
      formData.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      };
    }

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: user.PK,
        SK: "PROFILE",
      },
      UpdateExpression: "SET lastLoginAt = :lastLoginAt",
      ExpressionAttributeValues: {
        ":lastLoginAt": new Date().toISOString(),
      },
    });

    await dynamoDb.send(updateCommand);

    return {
      success: true,
      message: "Login successful",
      user: userResult.Items[0],
    };
  } catch (e) {
    console.error("Error logging in:", e);
    return {
      success: false,
      error: "LOGIN_ERROR",
      message: "An error occurred while logging in",
    };
  }
}
