"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateEnrollmentCount(courseId: string) {
  try {
    const command = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: "ADD enrollmentCount :increment",
      ExpressionAttributeValues: {
        ":increment": 1,
      },
    });
    await dynamoDb.send(command);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);

    return {
      sucess: true,
    };
  } catch (error) {
    console.error("Error updating enrollment count:", error);
    return {
      success: false,
      error: "Failed to update enrollment count",
    };
  }
}
