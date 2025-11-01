"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function getCourseSeo({
  courseId,
  locale,
}: {
  courseId: string;
  locale: string;
}) {
  try {
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
        courseSeo: response.Item,
      };
    }
  } catch (error) {
    console.error("Failed to get course SEO data:", error);
    return {
      success: false,
      courseSeo: null,
    };
  }
}
