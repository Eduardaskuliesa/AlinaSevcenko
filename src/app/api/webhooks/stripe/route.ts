import { logger } from "@/app/utils/logger";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import stripe from "@/app/services/stripe";
import { cloudflareWorkerActions } from "@/app/actions/cloudflareWorker";
import { getCourse } from "@/app/actions/enrolled-course/getCourse";
import {
  createPurchasedCourse,
  PurschaseCourseData,
} from "@/app/actions/enrolled-course/createEnrolledCourse";
import { updateEnrolledCourse } from "@/app/actions/enrolled-course/updateEnrolledCourse";
import { updateEnrollmentCount } from "@/app/actions/enrolled-course/updateEnrollmentCount";
import { updateCoursePreferences } from "@/app/actions/user/preferences/updateCoursePreferences";
import { fetchCourse } from "@/app/actions/coursers/course/getCourseClient";
import { fetchLessons } from "@/app/actions/coursers/lesson/getClientLessons";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const DAY_MS = 24 * 60 * 60 * 1000;

function computeExpiry(
  currentExpiry: string | undefined,
  durationDays: number
): string {
  if (durationDays === 0 || currentExpiry === "lifetime") return "lifetime";

  const current = currentExpiry ? new Date(currentExpiry).getTime() : 0;
  const base = Math.max(Date.now(), Number.isNaN(current) ? 0 : current);
  return new Date(base + durationDays * DAY_MS).toISOString();
}

async function enrollFromPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  const { courseIds, accessIds, userId } = paymentIntent.metadata;
  if (!courseIds || !accessIds || !userId) {
    logger.error(`PaymentIntent ${paymentIntent.id} has no enrollment metadata`);
    return;
  }

  const courseIdArray = courseIds.split(",");
  const accessIdArray = accessIds.split(",");
  const coursePreferences: { courseId: string; expiresAt: string }[] = [];

  for (let i = 0; i < courseIdArray.length; i++) {
    const courseId = courseIdArray[i];
    const accessPlanId = accessIdArray[i];

    const existing = (await getCourse(userId, courseId)).cousre;

    if (existing?.paymentId === paymentIntent.id) {
      logger.info(`Payment ${paymentIntent.id} already applied to ${courseId}`);
      coursePreferences.push({ courseId, expiresAt: existing.expiresAt });
      continue;
    }

    const { course, error } = await fetchCourse(courseId);
    if (error || !course) throw new Error(`Course ${courseId} not found`);

    const accessPlan = course.accessPlans?.find((p) => p.id === accessPlanId);
    if (!accessPlan) {
      throw new Error(`Access plan ${accessPlanId} not found for ${courseId}`);
    }

    const expiresAt = computeExpiry(existing?.expiresAt, accessPlan.duration);
    const purchaseFields = {
      purchaseId: paymentIntent.id,
      paymentId: paymentIntent.id,
      expiresAt,
      accessPlanName: accessPlan.name,
      accessPlanDuration: accessPlan.duration,
      pricePaid: accessPlan.price,
      purchaseDate: new Date().toISOString(),
      status: "ACTIVE" as const,
    };

    let result: { success: boolean; error?: unknown };

    if (existing) {
      result = await updateEnrolledCourse({
        ...(existing as unknown as PurschaseCourseData),
        ...purchaseFields,
      });
      logger.info(`Extended ${courseId}: ${existing.expiresAt} -> ${expiresAt}`);
    } else {
      const lessons = (await fetchLessons(courseId)) ?? [];
      const lessonProgress: PurschaseCourseData["lessonProgress"] = {};
      lessons
        .filter((lesson) => lesson.status === "ready")
        .forEach((lesson) => {
          lessonProgress[lesson.lessonId] = {
            progress: 0,
            completedAt: "",
            wasReworked: false,
          };
        });

      result = await createPurchasedCourse({
        ...purchaseFields,
        userId,
        courseId,
        slug: course.slug || "",
        duration: course.duration || 0,
        shortDescription: course.shortDescription || "",
        longDescription: course.description || "",
        lessonCount: course.lessonCount || 0,
        title: course.title || "",
        languge: course.language || "lt",
        thumbnailImage: course.thumbnailImage || "",
        lessonProgress,
      });

      if (result.success) await updateEnrollmentCount(courseId);
    }

    if (!result.success) {
      throw new Error(`Failed to save enrollment for ${courseId}`);
    }

    coursePreferences.push({ courseId, expiresAt });

    await cloudflareWorkerActions.reminder1Days(courseId, userId, expiresAt);
    await cloudflareWorkerActions.reminder7Days(courseId, userId, expiresAt);

    revalidateTag(`verify-purchase-${courseId}-${userId}`);
    revalidateTag(`learning-data-${courseId}-${userId}`);
  }

  await updateCoursePreferences(userId, coursePreferences);
  revalidateTag(`users-course-${userId}`);
}

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    logger.error("Invalid Stripe webhook signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      await enrollFromPaymentIntent(event.data.object);
      logger.success(`Enrollment processed for ${event.data.object.id}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
