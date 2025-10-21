"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { AccessPlan, Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAccessPlan(
  courseId: Course["courseId"],
  planId: AccessPlan["id"]
) {
  try {
    await verifyAdminAccess();
    const getCommand = new GetCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
    });

    const courseData = await dynamoDb.send(getCommand);

    if (!courseData.Item) {
      return {
        success: false,
        error: `COURSE_NOT_FOUND`,
      };
    }

    const course = courseData.Item;
    const currentPlans = course.accessPlans || [];
    const isPublished = course.isPublished || false;

    const planIndex = currentPlans.findIndex(
      (plan: AccessPlan) => plan.id === planId
    );

    if (planIndex === -1) {
      return {
        success: false,
        error: `PLAN_NOT_FOUND`,
      };
    }

    if (currentPlans.length === 1 && isPublished) {
      return {
        success: false,
        error: `LAST_PLAN_PUBLISHED`,
        message: "Cannot delete the last plan of a published course",
      };
    }

    const otherActivePlans = currentPlans.filter(
      (plan: AccessPlan) => plan.isActive && plan.id !== planId
    );
    const willHaveNoActivePlans = otherActivePlans.length === 0;

    const updatedPlans = [
      ...currentPlans.slice(0, planIndex),
      ...currentPlans.slice(planIndex + 1),
    ];

    let updateExpression = `
      SET accessPlans = :updatedPlans,
          updatedAt = :updatedAt
    `;

    const expressionAttributeValues: {
      ":updatedPlans": AccessPlan[];
      ":updatedAt": string;
      ":priceStatus"?: boolean;
    } = {
      ":updatedPlans": updatedPlans,
      ":updatedAt": new Date().toISOString(),
    };

    if (willHaveNoActivePlans && !isPublished) {
      updateExpression += `,
        completionStatus.price = :priceStatus
      `;
      expressionAttributeValues[":priceStatus"] = false;
    }

    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(updateCommand);

    logger.success(`Access plan ${planId} deleted successfully`);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag(`course-client-${courseId}`);
    revalidateTag("client-courses");
    revalidatePath(`/lt/courses/${courseData.Item.slug}`);
    revalidatePath(`/ru/courses/${courseData.Item.slugg}`);

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Error deleting access plan:", error);
    return {
      success: false,
      error: `UNKNOWN_ERROR`,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
