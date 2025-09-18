"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import stripe from "@/app/services/stripe";
import { EnrolledCourse } from "@/app/types/enrolled-course";
import { logger } from "@/app/utils/logger";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_cache } from "next/cache";

async function verify(userId: string, courseId: string) {
  try {
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: `PURCHASE#${userId}`,
        SK: `COURSE#${courseId}`,
      },
    });

    const response = (await dynamoDb.send(getCommand)).Item as EnrolledCourse;

    if (response === undefined) {
      logger.info(
        `No enrollment found for user ${userId} and course ${courseId}`
      );
      return { hasAccess: false, reason: "No enrollment found" };
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      response.paymentId
    );

    if (paymentIntent.status !== "succeeded") {
      return { hasAccess: false, reason: "Payment not completed" };
    }

    if (response.expiresAt !== "lifetime") {
      const expirationDate = new Date(response.expiresAt);
      const now = new Date();

      if (now > expirationDate) {
        return { hasAccess: false, reason: "Course access expired" };
      }
    }

    return {
      hasAccess: true,
      verified: true,
      enrolledCourse: response,
    };
  } catch (error) {
    console.error(
      `Error verifying purchase for user ${userId} and course ${courseId}`,
      error
    );
    return { hasAccess: false, reason: "Verification failed" };
  }
}
export async function verifyPurchase(
  userId: string,
  courseId: EnrolledCourse["courseId"]
) {
  const cacheTag = `verify-purchase-${courseId}-${userId}`;
  return unstable_cache(
    async () => {
      return verify(userId, courseId);
    },
    [cacheTag],
    { revalidate: 120, tags: [cacheTag] }
  )();
}
