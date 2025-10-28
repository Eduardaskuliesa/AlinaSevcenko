"use server";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export interface OAuthRegisterData {
  email: string;
  fullName: string;
  provider: "google"
  providerId: string;
}

export async function registerOAuth(formData: OAuthRegisterData) {
  try {
    const userId = uuidv4();

    const command = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `PROFILE`,
        SK: `USER#${userId}`,
        email: formData.email,
        password: null,
        userId: userId,
        fullName: formData.fullName,
        registrationMethod: formData.provider.toUpperCase(),
        providerId: formData.providerId,
        roles: "STUDENT",
        status: "VERIFIED",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        GSI1PK: formData.email,
        GSI1SK: "EMAIL",
      },
    });

    await dynamoDb.send(command);
    return {
      success: true,
      userId: userId,
      message: "OAuth user registered successfully",
    };
  } catch (e) {
    console.error("Error registering OAuth user:", e);
    return {
      success: false,
      message: "Error registering OAuth user",
    };
  }
}