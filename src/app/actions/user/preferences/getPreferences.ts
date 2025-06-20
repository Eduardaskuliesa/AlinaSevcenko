"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UserPreferences } from "@/app/types/user";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

async function fetchUserPreferences(userId: string) {
  logger.info("Fetching user preferences for userId:", userId);
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PREFERENCE#${userId}`,
        SK: `USER#${userId}`,
      },
      ProjectionExpression: "languge, courseAcess",
    });

    const preferences = await dynamoDb.send(getCommand);

    if (!preferences.Item) {
      logger.error("No preferences found for user:", userId);
      return {
        success: false,
        error: "No preferences found for user",
      };
    }

    return {
      sucess: true,
      preferences: preferences.Item as UserPreferences,
    };
  } catch (error) {
    logger.error("Error fetching user preferences:", error);
    return {
      success: false,
      error: "Failed to fetch user preferences",
    };
  }
}

export async function getPreferences() {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  if (!userId) {
    logger.error("No userId found in session");
    return;
  }
  const cacheTag = `user-preferences-${userId}`;

  const result = await unstable_cache(
    async () => {
      return await fetchUserPreferences(userId);
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();

  return result;
}
