"use server";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { AccessPlan, Course } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";

export async function deleteAccessPlan(
  courseId: Course["courseId"],
  planId: AccessPlan["id"]
) {
  try {
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

    // Check if this is the last plan and course is published
    if (currentPlans.length === 1 && isPublished) {
      return {
        success: false,
        error: `LAST_PLAN_PUBLISHED`,
        message: "Cannot delete the last plan of a published course",
      };
    }

    // If we get here, we can delete the plan
    const updatedPlans = [
      ...currentPlans.slice(0, planIndex),
      ...currentPlans.slice(planIndex + 1),
    ];

    // Update the course with the plan removed
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
          SET accessPlans = :updatedPlans,
              updatedAt = :updatedAt
        `,
      ExpressionAttributeValues: {
        ":updatedPlans": updatedPlans,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(updateCommand);

    logger.success(`Access plan ${planId} deleted successfully`);
    revalidateTag(`course-${courseId}`);

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
