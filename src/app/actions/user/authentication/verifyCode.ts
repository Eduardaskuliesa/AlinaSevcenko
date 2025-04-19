import { dynamoTableName, dynamoDb } from "@/services/dynamoDB";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
export async function verifyCode(tempId: string, code: string) {
  try {
    const verifyCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `VERIFICATION#${tempId}`,
        ":sk": `CODE#${code}`,
      },
    });

    const result = await dynamoDb.send(verifyCommand);

    if (!result.Items || result.Items.length === 0) {
      return {
        success: false,
        message:
          "Invalid verification code. Please try again or request a new code.",
      };
    }

    const verificationRecord = result.Items[0];

    const currentTime = Math.floor(Date.now() / 1000);
    if (verificationRecord.ttl < currentTime) {
      return {
        success: false,
        message: "Verification code has expired. Please request a new code.",
      };
    }

    return {
      success: true,
      message: "Email verified successfully",
      email: verificationRecord.email,
    };
  } catch (error) {
    console.error("Error verifying code:", error);
    return {
      success: false,
      message: "Error processing verification. Please try again.",
    };
  }
}
