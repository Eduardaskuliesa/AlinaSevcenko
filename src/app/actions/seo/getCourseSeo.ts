"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { CourseSeo } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function fetchCourseSeo({
  courseId,
  locale,
}: {
  courseId: string;
  locale: string;
}) {
  try {
    logger.info(`Fetching SEO fresh data from Server`);
    const command = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE_SEO",
        SK: `COURSE_SEO#${courseId}#${locale}`,
      },
    });

    const response = await dynamoDb.send(command);

    if (response.Item) {
      return {
        success: true,
        courseSeo: response.Item as CourseSeo,
      };
    }
    return {
      success: true,
      courseSeo: null,
    };
  } catch (error) {
    console.error("Failed to get course SEO data:", error);
    return {
      success: false,
      courseSeo: null,
    };
  }
}

export async function getCourseSeo({
  courseId,
  locale,
}: {
  courseId: string;
  locale: string;
}) {
  const cacheTag = `course-seo-${courseId}-${locale}`;
  return unstable_cache(
    async () => {
      return fetchCourseSeo({ courseId, locale });
    },
    [cacheTag],
    { revalidate: 72000, tags: [cacheTag] }
  )();
}
