import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { EnrolledCourse } from "@/app/types/enrolled-course";
import { logger } from "@/app/utils/logger";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export interface PurschaseCourseData {
  courseId: string;
  userId: string;
  purchaseId: string;
  paymentId: string;
  title: string;
  purchaseDate: string;
  expiresAt: string;
  status: "ACTIVE" | "EXPIRED";
  languge: string;
  thumbnailImage: string;
  accessPlanName: string;
  accessPlanDuration: number;
  lessonProgress: {
    [lessonId: string]: {
      progress: number;
      completedAt?: string;
      wasReworked?: boolean;
    };
  };
}

export async function createPurchasedCourse(courseData: PurschaseCourseData) {
  try {
    const timestamp = new Date().toISOString();

    const item: EnrolledCourse = {
      PK: `PURCHASE#${courseData.userId}`,
      SK: `COURSE#${courseData.courseId}`,
      courseId: courseData.courseId,
      userId: courseData.userId,
      purchaseId: courseData.purchaseId,
      paymentId: courseData.paymentId,
      title: courseData.title,
      purchaseDate: courseData.purchaseDate,
      expiresAt: courseData.expiresAt,
      status: courseData.status,
      languge: courseData.languge,
      thumbnailImage: courseData.thumbnailImage,
      accessPlanName: courseData.accessPlanName,
      accessPlanDuration: courseData.accessPlanDuration,
      lessonProgress: courseData.lessonProgress,
      courseVersion: 1,
      lastLessonId: null,
      lastLessonWatchTime: 0,
      overallProgress: 0,
      lastSyncedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const createCommand = new PutCommand({
      TableName: dynamoTableName,
      Item: item,
    });

    await dynamoDb.send(createCommand);

    logger.success("Course enrolled successfully");

    return {
      success: true,
      message: "Course enrolled successfully",
      enrolledCourse: item,
    };
  } catch (error) {
    logger.error("Error enrolling course", error);
    return {
      success: false,
      message: "Error enrolling course",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
