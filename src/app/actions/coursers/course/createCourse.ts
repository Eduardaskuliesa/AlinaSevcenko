"use server";

import { dynamoDb } from "@/services/dynamoDB";
import { dynamoTableName } from "@/services/dynamoDB";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

export interface CreateCourseInitialData {
  title: string;
  authorId: string;
}

export interface CourseFormData {
  title?: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  thumbnailImage?: string;
  price?: number;
  currency?: string;
  language?: string;
  accessPlans?: {
    planId: string;
    name: string;
    duration: number | null;
    price: number;
  }[];
}

export async function createCourse(initialData: CreateCourseInitialData) {
  try {
    console.log(initialData)
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
      image: "",
      thumbnailImage: "",
      price: 0,
      currency: "EUR",
      language: "lt",
      status: "DRAFT",
      lessonCount: 0,
      authorId: initialData.authorId,
      accessPlans: [
        {
          planId: "PLAN#DEFAULT",
          name: "Lifetime Access",
          duration: null,
          price: 0,
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: null,
      completionStatus: {
        title: true,
        description: false,
        price: false,
        category: false,
        lessons: false,
        thumbnail: false,
      },
      completionPercentage: 17,
      canBePublished: false,
    };

    const command = new PutCommand({
      TableName: dynamoTableName,
      Item: courseData,
    });

    await dynamoDb.send(command);

    return {
      success: true,
      courseId: courseId,
      message: "Course created successfully",
      completionPercentage: 17,
    };
  } catch (e) {
    console.error("Error creating course:", e);
    return {
      success: false,
      message: "Error creating course",
    };
  }
}
