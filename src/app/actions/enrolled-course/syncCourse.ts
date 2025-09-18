"use server";
import { logger } from "@/app/utils/logger";
import { enrolledCourseActions } from ".";
import { coursesAction } from "../coursers";
import { EnrolledCourse } from "@/app/types/enrolled-course";
import { Course, Lesson } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

const syncEnrolledCourse = async (
  userId: string,
  courseId: string,
  currentCourse: Course,
  sanitizedLessons: Lesson[],
  enrolledCourse: EnrolledCourse
) => {
  try {
    const newLessonProgress: Record<
      string,
      EnrolledCourse["lessonProgress"][string]
    > = {};
    const existingProgress = enrolledCourse.lessonProgress || {};

    sanitizedLessons.forEach((lesson) => {
      newLessonProgress[lesson.lessonId] = existingProgress[
        lesson.lessonId
      ] || {
        progress: 0,
        completedAt: "",
        wasReworked: false,
      };
    });

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET lessonProgress = :lessonProgress,
            lessonCount = :lessonCount,
            #duration = :duration,
            title = :title,
            thumbnailImage = :thumbnailImage,
            shortDescription = :shortDescription,
            slug = :slug,
            lastSyncedAt = :lastSyncedAt,
            courseVersion = :courseVersion
      `,
      ExpressionAttributeNames: {
        "#duration": "duration",
      },
      ExpressionAttributeValues: {
        ":lessonProgress": newLessonProgress,
        ":lessonCount": sanitizedLessons.length,
        ":duration": currentCourse.duration,
        ":title": currentCourse.title,
        ":thumbnailImage": currentCourse.thumbnailImage,
        ":shortDescription": currentCourse.shortDescription,
        ":slug": currentCourse.slug,
        ":lastSyncedAt": new Date().toISOString(),
        ":courseVersion": (enrolledCourse.courseVersion || 1) + 1,
      },
    });

    await dynamoDb.send(updateCommand);

    logger.info(
      `Successfully synced enrolled course for user ${userId}, course ${courseId}`
    );
  } catch (error) {
    logger.error(`Error syncing enrolled course: ${error}`);
    throw error;
  }
};

export async function syncCourseAction(courseId: string, userId: string) {
  try {
    const enrolledCourseData = await enrolledCourseActions.getCourse(
      courseId,
      userId
    );
    if (enrolledCourseData.error) {
      logger.error(
        `Error fetching enrolled course data for courseId: ${courseId}`,
        enrolledCourseData.error
      );
      return { error: "Failed to fetch enrolled course data" };
    }

    const lessonData = await enrolledCourseActions.getLessons(courseId);
    if (lessonData?.length === 0) {
      logger.error(`No lesson data found for courseId: ${courseId}`);
      return { error: "No lesson data found" };
    }

    const clientCourseData = await coursesAction.courses.getCourseClient(
      courseId
    );
    if (clientCourseData.error) {
      logger.error(
        `Error fetching client course data for courseId: ${courseId}`,
        clientCourseData.error
      );
      return { error: "Failed to fetch client course data" };
    }

    const sanitizedLessons = lessonData
      ?.filter((lesson) => lesson.status === "ready")
      .sort((a, b) => {
        const orderA =
          clientCourseData?.course?.lessonOrder?.find(
            (order) => order.lessonId === a.lessonId
          )?.sort ?? 999;
        const orderB =
          clientCourseData?.course?.lessonOrder?.find(
            (order) => order.lessonId === b.lessonId
          )?.sort ?? 999;
        return orderA - orderB;
      });

    await syncEnrolledCourse(
      userId,
      courseId,
      clientCourseData.course as Course,
      sanitizedLessons as Lesson[],
      enrolledCourseData.cousre as EnrolledCourse
    );
    revalidateTag(`learning-data-${courseId}-${userId}`);
    revalidateTag(`user-lesson-${courseId}`);
    revalidateTag(`enrolled-course-${userId}`);
    revalidateTag(`course-client-${courseId}`);

    logger.success(`Course synced for user ${userId}, course ${courseId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error in syncCourseAction: ${error}`);
    return { error: "Sync failed" };
  }
}
