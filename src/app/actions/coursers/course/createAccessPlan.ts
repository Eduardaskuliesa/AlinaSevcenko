"use server";
import { AccessPlan, Course } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";
import { logger } from "@/app/utils/logger";
import { v4 as uuidv4 } from "uuid";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";

export interface AccessPlansData {
  accessPlans: Omit<AccessPlan, "id">[];
}

export async function createAccessPlan(
  courseId: Course["courseId"],
  accessPlansData: AccessPlansData
) {
  try {
     await verifyAdminAccess();
    const timestamp = new Date().toISOString();

    const plansWithIds = accessPlansData.accessPlans.map((plan) => ({
      ...plan,
      id: uuidv4(),
    }));

    const updateExpression = `
      SET accessPlans = list_append(if_not_exists(accessPlans, :emptyList), :newPlans),
          updatedAt = :updatedAt,
          completionStatus.price = :price
    `;

    const expressionAttributeValues: {
      ":newPlans": AccessPlan[];
      ":emptyList": never[];
      ":updatedAt": string;
      ":price": boolean;
    } = {
      ":newPlans": plansWithIds,
      ":emptyList": [],
      ":updatedAt": timestamp,
      ":price": true,
    };

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

    logger.success("Course access plans updated successfully");
    revalidateTag(`course-${courseId}`);
    revalidateTag(`courses`);
    revalidateTag(`course-client-${courseId}`);
    revalidateTag("client-courses");

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Error updating access plans:", error);
    return {
      success: false,
      error: `UNKNOWN_ERROR`,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
