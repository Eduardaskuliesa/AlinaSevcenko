"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function updateSlug(
  slugId: string,
  courseId: string,
  slug: string
) {
  try {
    await verifyAdminAccess();

    const updateSlugCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "SLUG",
        SK: `SLUG#${slugId}`,
      },
      UpdateExpression: "SET slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
    });

    await dynamoDb.send(updateSlugCommand);

    const updateCourseCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: "SET slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
    });

    await dynamoDb.send(updateCourseCommand);
    revalidateTag("client-courses");
    return {
      success: true,
      message: "Slug updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: `Error updating slug ${error}`,
    };
  }
}
