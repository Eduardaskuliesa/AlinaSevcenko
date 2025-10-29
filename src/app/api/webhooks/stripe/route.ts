/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { logger } from "@/app/utils/logger";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { PurschaseCourseData } from "@/app/actions/enrolled-course/createEnrolledCourse";
import { cloudflareWorkerActions } from "@/app/actions/cloudflareWorker";
import { revalidateTag } from "next/cache";
import { userActions } from "@/app/actions/user";
import { coursesAction } from "@/app/actions/coursers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  logger.success("Received webhook request from Stripe");

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const coursePreferences = [];

    if (event.type === "payment_intent.succeeded") {
      const metadata = event.data.object.metadata;

      const { courseIds, accessIds, userId } = metadata as Stripe.Metadata;

      const courseIdArray = courseIds.split(",");
      const accessIdArray = accessIds.split(",");

      for (let i = 0; i < courseIdArray.length; i++) {
        const courseId = courseIdArray[i];
        const accessPlanId = accessIdArray[i];

        logger.info(
          `Processing course ID: ${courseId}, Access Plan: ${accessPlanId}`
        );

        const course = (await coursesAction.courses.getCourseClient(courseId))
          .course;
        const lessons = await coursesAction.lessons.getClientLessons(courseId);

        const accessPlan = course?.accessPlans?.find(
          (plan) => plan.id === accessPlanId
        );

        if (!accessPlan) {
          logger.error(
            `Access plan ${accessPlanId} not found for course ${courseId}`
          );
          continue;
        }

        const lifeTime = accessPlan.duration === 0;

        // Check if course already exists
        const existingCourse = await enrolledCourseActions.getCourse(
          userId,
          courseId
        );

        let enrolledCourseData: PurschaseCourseData;

        if (existingCourse) {
          const newExpiresAt =
            lifeTime || existingCourse.cousre?.expiresAt === "lifetime"
              ? "lifetime"
              : new Date(
                  new Date(existingCourse.cousre?.expiresAt!).getTime() +
                    accessPlan.duration * 24 * 60 * 60 * 1000
                ).toISOString();

          enrolledCourseData = {
            ...existingCourse.cousre!,
            purchaseId: event.data.object.id,
            paymentId: event.data.object.id as string,
            expiresAt: newExpiresAt,
            accessPlanName: accessPlan.name,
            accessPlanDuration: accessPlan.duration,
            pricePaid: accessPlan.price,
            purchaseDate: new Date().toISOString(),
            status: "ACTIVE",
          };

          logger.info(
            `Extending course ${courseId} - Old expiry: ${existingCourse.cousre?.expiresAt}, New expiry: ${newExpiresAt}`
          );
        } else {
          const lessonProgress: {
            [lessonId: string]: {
              progress: number;
              completedAt?: string;
              wasReworked?: boolean;
            };
          } = {};

          lessons?.forEach((lesson) => {
            lessonProgress[lesson.lessonId] = {
              progress: 0,
              completedAt: "",
              wasReworked: false,
            };
          });

          const expiresAt = lifeTime
            ? "lifetime"
            : new Date(
                Date.now() + accessPlan.duration * 24 * 60 * 60 * 1000
              ).toISOString();

          enrolledCourseData = {
            purchaseId: event.data.object.id,
            paymentId: event.data.object.id as string,
            userId: userId,
            courseId: courseId,
            slug: course?.slug || "",
            duration: course?.duration || 0,
            shortDescription: course?.shortDescription || "",
            longDescription: course?.description || "",
            lessonCount: course?.lessonCount || 0,
            title: course?.title || "",
            languge: course?.language || "lt",
            accessPlanName: accessPlan.name,
            accessPlanDuration: accessPlan.duration,
            pricePaid: accessPlan.price,
            thumbnailImage: course?.thumbnailImage || "",
            purchaseDate: new Date().toISOString(),
            expiresAt: expiresAt,
            status: "ACTIVE",
            lessonProgress: lessonProgress,
          };

          logger.info(`Creating new enrolled course ${courseId}`);
        }

        coursePreferences.push({
          courseId: courseId,
          expiresAt: enrolledCourseData.expiresAt,
        });

        const createResponse = existingCourse
          ? await enrolledCourseActions.updateEnrolledCourse(enrolledCourseData)
          : await enrolledCourseActions.createPurchasedCourse(
              enrolledCourseData
            );

        if (!createResponse.success) {
          logger.error(
            `Failed to create/update enrolled course: ${createResponse.error}`
          );

          return new Response("Course creation/update failed", {
            status: 500,
          });
        }

        if (createResponse.success) {
          await enrolledCourseActions.updateEnrollmentCount(courseId);

          await cloudflareWorkerActions.reminder1Days(
            courseId,
            userId,
            enrolledCourseData.expiresAt
          );

          await cloudflareWorkerActions.reminder7Days(
            courseId,
            userId,
            enrolledCourseData.expiresAt
          );

          await userActions.preferences.updateCoursePreferences(
            userId,
            coursePreferences
          );
        }

        revalidateTag(`users-course-${userId}`);
        logger.success("Enrolled course processed successfully");
      }
    }

    return NextResponse.json({ recieved: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
