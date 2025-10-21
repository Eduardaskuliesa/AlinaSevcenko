"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateLanguagePreferences(
  language: string,
  userId: string
) {
  try {
    console.log(language, userId);
    console.log("Updating language preferences for user:", userId, language);
    const command = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PREFERENCE#${userId}`,
        SK: `USER#${userId}`,
      },

      UpdateExpression: "SET languge = :languge",
      ExpressionAttributeValues: {
        ":languge": language,
      },
    });

    const response = await dynamoDb.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        success: false,
        error: "Failed to update language preferences",
      };
    }
    revalidateTag(`user-preferences-${userId}`);
    logger.success("Language preferences updated successfully");
    return {
      success: true,
      message: "Language preferences updated successfully",
    };
  } catch (error) {
    console.error("Error updating language preferences:", error);
    return {
      success: false,
      error: "Failed to update language preferences",
    };
  }
}
