"use server";
import { coursesAction } from "../coursers";
import { logger } from "@/app/utils/logger";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";

interface CourseSeoData {
  metaTitle: string;
  metaDescription: string;
  locale: string;
  courseId: string;
}

export async function createCourseSeo(courseData: CourseSeoData) {
  try {
    const getCourseResponses = await coursesAction.courses.getCourse(
      courseData.courseId
    );
    if (!getCourseResponses.cousre) {
      logger.error("Course not found");
      return {
        success: false,
        error: "Course not found",
      };
    }
    const timestamp = new Date().toISOString();
    const command = new PutCommand({
      TableName: dynamoTableName,
      Item: {
        PK: "COURSE_SEO",
        SK: `COURSE_SEO#${courseData.courseId}#${courseData.locale}`,
        courseId: courseData.courseId,
        locale: courseData.locale,
        metaTitle: courseData.metaTitle,
        metaDescription: courseData.metaDescription,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    const response = await dynamoDb.send(command);

    if (
      !response.$metadata.httpStatusCode ||
      response.$metadata.httpStatusCode !== 200
    ) {
      logger.error("Failed to create course SEO data");
      return {
        success: false,
        error: "Failed to create course SEO data",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to create course SEO data:", error);
  }
}
