"use server";
import { dynamoTableName, dynamoDb } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function verifyToken(token: string) {
  logger.info(`Verification request for token: ${token}`);
  try {
    const verifyCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `VERIFICATION#${token}`,
      },
    });

    const result = await dynamoDb.send(verifyCommand);

    if (!result.Items || result.Items.length === 0) {
      return {
        success: false,
        error: "INVALID_VERIFICATION_LINK",
        message:
          "Invalid verification link. Please request a new verification email.",
      };
    }

    const verificationRecord = result.Items[0];

    const currentTime = Math.floor(Date.now() / 1000);
    if (verificationRecord.ttl < currentTime) {
      return {
        success: false,
        error: "VERIFICATION_LINK_EXPIRED",
        message:
          "Verification link has expired. Please request a new verification email.",
      };
    }

    if (verificationRecord.verified) {
      return {
        success: false,
        error: "ALREADY_VERIFIED",
        message: "Email is already verified.",
      };
    }

    const userId = verificationRecord.SK.split("#")[1];

    const updateVerificationCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `VERIFICATION#${token}`,
        SK: verificationRecord.SK,
      },
      UpdateExpression: "SET verified = :verified",
      ExpressionAttributeValues: {
        ":verified": true,
      },
    });

    await dynamoDb.send(updateVerificationCommand);

    const updateUserCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PROFILE`,
        SK: `USER#${userId}`,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "VERIFIED",
      },
      ReturnValues: "ALL_NEW",
    });

    const user = await dynamoDb.send(updateUserCommand);

    return {
      success: true,
      message: "Email verified successfully",
      email: verificationRecord.email,
      user: user.Attributes,
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      success: false,
      message: "Error processing verification. Please try again.",
    };
  }
}
