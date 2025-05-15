"use server";

import { CreateCourseInitialData } from "@/app/types/course";
import { dynamoDb } from "@/app/services/dynamoDB";
import { dynamoTableName } from "@/app/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/app/utils/logger";
import { revalidateTag } from "next/cache";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { createSlug } from "./createSlug";

function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .normalize("NFD") // Normalize Unicode (decompose accented chars)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics/accents
    .replace(/[^\w\s-]/g, "") // Remove special characters except whitespace and hyphens
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

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
    const slug = generateSlug(initialData.title);

    const slugResponse = await createSlug({ slug, courseId });

    if (!slugResponse.success) {
      return {
        success: false,
        message: "Error creating slug",
      };
    }

    const courseData = {
      PK: "COURSE",
      SK: `COURSE#${courseId}`,
      courseId: courseId,
      title: initialData.title,
      slug: slug,
      slugId: slugResponse.slugId,
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
    revalidateTag("client-courses");
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
