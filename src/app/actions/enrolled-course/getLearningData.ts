"use server";
import { logger } from "@/app/utils/logger";
import { enrolledCourseActions } from ".";
import { coursesAction } from "../coursers";
import { EnrolledCourse } from "@/app/types/enrolled-course";
import { Course, Lesson } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

const needsSync = (
  enrolledCourse: EnrolledCourse,
  currentCourse: Course,
  currentLessons: Lesson[]
) => {
  const readyLessons = currentLessons.filter((l) => l.status === "ready");

  if (enrolledCourse.lessonCount !== readyLessons.length) {
    return true;
  }

  if (enrolledCourse.duration !== currentCourse.duration) {
    return true;
  }

  if (enrolledCourse.title !== currentCourse.title) {
    return true;
  }

  if (enrolledCourse.shortDescription !== currentCourse.shortDescription) {
    return true;
  }

  if (enrolledCourse.slug !== currentCourse.slug) {
    return true;
  }

  if (enrolledCourse.thumbnailImage !== currentCourse.thumbnailImage) {
    return true;
  }

  const enrolledLessonIds = Object.keys(enrolledCourse.lessonProgress || {});
  const currentLessonIds = readyLessons.map((l) => l.lessonId);

  const missingLessons = currentLessonIds.filter(
    (id) => !enrolledLessonIds.includes(id)
  );
  if (missingLessons.length > 0) {
    return true;
  }

  return false;
};

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
      EnrolledCourse["lessonProgress"][""]
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
            duration = :duration,
            title = :title,
            thumbnailImage = :thumbnailImage,
            shortDescription = :shortDescription,
            slug = :slug,
            lastSyncedAt = :lastSyncedAt,
            courseVersion = :courseVersion
      `,
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

async function fetchLearningData(courseId: string, userId: string) {
  logger.info(`Fetching fresh learning data`);
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
      return;
    }

    const lessonData = await enrolledCourseActions.getLessons(courseId);

    if (lessonData?.length === 0) {
      logger.error(`No lesson data found for courseId: ${courseId}`);
      return;
    }
    const clientCourseData = await coursesAction.courses.getCourseClient(
      courseId
    );

    if (clientCourseData.error) {
      logger.error(
        `Error fetching client course data for courseId: ${courseId}`,
        clientCourseData.error
      );
      return;
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

    if (
      needsSync(
        enrolledCourseData?.cousre as EnrolledCourse,
        clientCourseData.course as Course,
        lessonData as Lesson[]
      )
    ) {
      await syncEnrolledCourse(
        userId,
        courseId,
        clientCourseData.course as Course,
        sanitizedLessons as Lesson[],
        enrolledCourseData.cousre as EnrolledCourse
      );
      logger.info(`Course synced for user ${userId}, course ${courseId}`);
    }

    return {
      course: enrolledCourseData.cousre as EnrolledCourse,
      lessons: sanitizedLessons as Lesson[],
    };
  } catch (error) {
    console.error("Error fetching learning data:", error);
  }
}

export async function getLearningData(
  courseId: EnrolledCourse["courseId"],
  userId: string
) {
  const cacheTag = `learning-data-${courseId}-${userId}`;
  return unstable_cache(
    async () => {
      return fetchLearningData(courseId, userId);
    },
    [cacheTag],
    { revalidate: 1080, tags: [cacheTag] }
  )();
}
