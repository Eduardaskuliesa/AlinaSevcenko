"use server";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function checkEmail(email: string) {
  try {
    const command = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression:
        "GSI1PK = :email AND GSI1SK = :registrationMethod",
      ExpressionAttributeValues: {
        ":email": email,
        ":registrationMethod": "EMAIL",
      },
    });
    const emailResult = await dynamoDb.send(command);

    if (emailResult.Items && emailResult.Items.length > 0) {
      return {
        error: "EMAIL_ALREADY_EXISTS",
        success: false,
        message: "An account with this email already exists",
      };
    }

    return {
      success: true,
      message: "Email is available",
    };
  } catch (error) {
    console.error("Error checking email availability:", error);
    return {
      success: false,
      message: `Error checking email availability:${error}`,
    };
  }
}
