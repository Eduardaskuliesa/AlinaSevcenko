"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { Slug } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchSlugs() {
  logger.info("Fetching all slugs");
  try {
    const getCommand = new QueryCommand({
      TableName: dynamoTableName,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": "SLUG",
      },
    });

    const slugs = (await dynamoDb.send(getCommand)).Items as Slug[];

    return {
      success: true,
      slugs: slugs.map((slug) => ({
        slugId: slug.SK.split("#")[1],
        slug: slug.slug,
        courseId: slug.courseId,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: `Error fetching slugs: ${error}`,
    };
  }
}

export async function getSlugs() {
  const cacheTag = `slugs`;
  return unstable_cache(
    async () => {
      const result = await fetchSlugs();
      return result;
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
