"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { AccessPlan, Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function toggleAccessPlanStatus(
  courseId: Course["courseId"],
  planId: AccessPlan["id"],
  isActive: boolean
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

    const activePlansCount = currentPlans.filter(
      (plan: AccessPlan) => plan.isActive && plan.id !== planId
    ).length;

    if (!isActive && activePlansCount === 0 && isPublished) {
      return {
        success: false,
        error: `LAST_PLAN_PUBLISHED`,
        message: "Cannot deactivate the last active plan of a published course",
      };
    }

    const updatedPlans = [...currentPlans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      isActive,
    };

    const currentlyHasActivePlans = currentPlans.some(
      (plan: AccessPlan) => plan.isActive
    );
    const willHaveActivePlans = updatedPlans.some(
      (plan: AccessPlan) => plan.isActive
    );

    let updateExpression =
      "SET accessPlans = :updatedPlans, updatedAt = :updatedAt";
    const expressionAttributeValues: {
      ":updatedPlans": AccessPlan[];
      ":updatedAt": string;
      ":priceStatus"?: boolean;
    } = {
      ":updatedPlans": updatedPlans,
      ":updatedAt": new Date().toISOString(),
    };

    if (!currentlyHasActivePlans && willHaveActivePlans) {
      updateExpression += ", completionStatus.price = :priceStatus";
      expressionAttributeValues[":priceStatus"] = true;
    } else if (currentlyHasActivePlans && !willHaveActivePlans) {
      updateExpression += ", completionStatus.price = :priceStatus";
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

    logger.success(`Access plan ${planId} status updated successfully`);
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag("client-courses");

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Error updating access plan status:", error);
    return {
      success: false,
      error: `UNKNOWN_ERROR`,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
