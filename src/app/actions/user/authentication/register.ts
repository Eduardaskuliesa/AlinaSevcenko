"use server";
import { dynamoDb } from "@/services/dynamoDB";
import { dynamoTableName } from "@/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface RegisterFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export async function register(formData: RegisterFormData) {
  try {
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const userId = uuidv4();

    const command = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `USER#${userId}`,
        SK: "PROFILE",
        email: formData.email,
        password: hashedPassword,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        registrationMethod: "EMAIL",
        roles: "STUDENT",
        status: "PENDING_VERIFICATION",
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        GSI1PK: formData.email,
        GSI1SK: "EMAIL",
      },
    });

    await dynamoDb.send(command);
    return {
      success: true,
      userId: userId,
      message: "User registered successfully",
    };
  } catch (e) {
    console.error("Error registering user:", e);
    return {
      success: false,
      message: "Error registering user",
    };
  }
}
