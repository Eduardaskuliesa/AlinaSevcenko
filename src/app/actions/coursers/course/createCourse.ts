"use server";

import { CreateCourseInitialData } from "@/app/types/course";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/app/utils/logger";
import { revalidateTag } from "next/cache";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";

export async function createCourse(initialData: CreateCourseInitialData) {
  try {
    await verifyAdminAccess();

    if (!initialData.authorId || !initialData.title) {
      return {
        success: false,
        message: "Missing fields",
      };
    }
    const courseId = uuidv4();
    const timestamp = new Date().toISOString();

    const courseData = {
      PK: "COURSE",
      SK: `COURSE#${courseId}`,
      courseId: courseId,
      title: initialData.title,
      description: "",
      shortDescription: "",
      thumbnailImage: "",
      sort: 0,
      currency: "EUR",
      language: "lt",
      status: "DRAFT",
      lessonOrder: [],
      lessonCount: 0,
      enrollmentCount: 0,
      authorId: initialData.authorId,
      accessPlans: [],
      createdAt: timestamp,
      isPublished: false,
      updatedAt: timestamp,
      publishedAt: null,
      duration: 0,
      completionStatus: {
        title: true,
        description: false,
        price: false,
        category: false,
        lessons: false,
        thumbnail: false,
      },
      canBePublished: false,
    };

    const command = new PutCommand({
      TableName: dynamoTableName,
      Item: courseData,
    });
    revalidateTag(`courses`);
    revalidateTag(`course-${courseId}`);
    await dynamoDb.send(command);

    return {
      success: true,
      courseId: courseId,
      message: "Course created successfully",
      completionPercentage: 17,
    };
  } catch (e) {
    logger.error("Failed to create course", e);
    return {
      success: false,
      message: "Error creating course",
    };
  }
}
