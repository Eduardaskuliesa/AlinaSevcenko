"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { logger } from "@/app/utils/logger";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

interface SlugData {
  slug: string;
  courseId: string;
}

export async function createSlug(data: SlugData) {
  try {
    await verifyAdminAccess();

    const checkCommand = new QueryCommand({
      TableName: dynamoTableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :slug",
      ExpressionAttributeValues: { ":slug": data.slug },
    });

    const existing = await dynamoDb.send(checkCommand);

    let finalSlug = data.slug;
    if (existing.Items && existing.Items.length > 0) {
      finalSlug = `${data.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const slugId = uuidv4();
    const timestamp = new Date().toISOString();

    const createCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: "SLUG",
        SK: `SLUG#${slugId}`,
        slug: finalSlug,
        slugId: slugId,
        redirect: false,
        redirectTo: null,
        courseId: data.courseId,
        createdAt: timestamp,
        updatedAt: timestamp,
        GSI1PK: finalSlug,
        GSI1SK: `COURSE#${data.courseId}`,
      },
    });

    await dynamoDb.send(createCommand);

    logger.success(`Slug created with name: ${finalSlug}`);
    return { success: true, slugId, finalSlug };
  } catch (error) {
    return { success: false, error: `Error creating slug: ${error}` };
  }
}
