
import { v4 as uuidv4 } from "uuid";
import { dynamoDb, dynamoTableName } from "@/services/dynamoDB";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function generateVerificationCode(email: string) {
  try {
    const checkEmailCommand = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :email AND GSI1SK = :method",
      ExpressionAttributeValues: {
        ":email": email,
        ":method": "EMAIL",
      },
    });

    const emailResult = await dynamoDb.send(checkEmailCommand);

    if (emailResult.Items && emailResult.Items.length > 0) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const tempId = uuidv4();

    const expirationTime = Math.floor(Date.now() / 1000) + 5 * 60;

    const storeCodeCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: `VERIFICATION#${tempId}`,
        SK: `CODE#${verificationCode}`,
        email: email,
        ttl: expirationTime,
        createdAt: new Date().toISOString(),
      },
    });

    await dynamoDb.send(storeCodeCommand);

    return {
      success: true,
      message: "Verification code sent to your email",
      tempId: tempId,
      code: verificationCode, 
    };
  } catch (error) {
    console.error("Error generating verification code:", error);
    return {
      success: false,
      message: "Unable to send verification code. Please try again.",
    };
  }
}
