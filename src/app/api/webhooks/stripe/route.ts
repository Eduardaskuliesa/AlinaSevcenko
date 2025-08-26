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

    if (event.type === "checkout.session.completed") {
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

        const course = (await coursesAction.courses.getCourseClient(courseId)).course;
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

        const lifeTime = accessPlan.duration === 0;

        const expiresAt = lifeTime
          ? "lifetime"
          : new Date(
              Date.now() + accessPlan.duration * 24 * 60 * 60 * 1000
            ).toISOString();

        coursePreferences.push({
          courseId: courseId,
          expiresAt: lifeTime ? "lifetime" : expiresAt,
        });

        const enrolledCourseData: PurschaseCourseData = {
          purchaseId: event.data.object.id,
          paymentId: event.data.object.payment_intent as string,
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

        const createResponse =
          await enrolledCourseActions.createPurchasedCourse(enrolledCourseData);

        if (!createResponse.success) {
          logger.error(
            `Failed to create enrolled course: ${createResponse.error}`
          );

          return new Response("Course creation failed", { status: 500 });
        }

        if (createResponse.success) {
          await enrolledCourseActions.updateEnrollmentCount(courseId);

          await cloudflareWorkerActions.reminder1Days(
            courseId,
            userId,
            expiresAt
          );

          await cloudflareWorkerActions.reminder7Days(
            courseId,
            userId,
            expiresAt
          );

          await userActions.preferences.updateCoursePreferences(
            userId,
            coursePreferences
          );
        }

        revalidateTag(`users-course-${userId}`);
        logger.success("Enrolled course created successfully:");
      }
    }

    return NextResponse.json({ recieved: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
