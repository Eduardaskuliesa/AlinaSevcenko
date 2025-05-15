"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

interface SlugData {
  slug: string;
  courseId: string;
}

export async function createSlug(data: SlugData) {
  try {
    await verifyAdminAccess();
    const slugId = uuidv4();
    const timestamp = new Date().toISOString();

    const createCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: "SLUG",
        SK: `SLUG#${slugId}`,
        slug: data.slug,
        slugId: slugId,
        redirect: false,
        redirectTo: null,
        courseId: data.courseId,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await dynamoDb.send(createCommand);
    logger.success("Slug created successfully");
    return {
      success: true,
      slugId: slugId,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating slug: ${error}`,
    };
  }
}
