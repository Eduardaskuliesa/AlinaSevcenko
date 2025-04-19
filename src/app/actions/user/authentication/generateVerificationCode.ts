"use server";
import { v4 as uuidv4 } from "uuid";
import { dynamoDb, dynamoTableName } from "@/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function generateVerificationToken(userId: string) {
  try {
    const verificationToken = uuidv4();

    const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24hours

    const storeTokenCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `VERIFICATION#${verificationToken}`,
        SK: `USER#${userId}`,
        ttl: expirationTime,
        createdAt: new Date().toISOString(),
        verified: false,
      },
    });

    await dynamoDb.send(storeTokenCommand);

    return {
      success: true,
      message: "Verification email sent",
      token: verificationToken,
    };
  } catch (error) {
    console.error("Error generating verification token:", error);
    return {
      success: false,
      message: "Unable to send verification email. Please try again.",
    };
  }
}
