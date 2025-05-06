"use server";

import { AccessPlan, Course } from "@/app/types/course";
import { dynamoDb, dynamoTableName } from "@/app/services/dynamoDB";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { revalidateTag } from "next/cache";
import { logger } from "@/app/utils/logger";
import { v4 as uuidv4 } from "uuid";

export interface AccessPlansData {
  accessPlans: Omit<AccessPlan, "id">[];
}

export async function updateAccessPlans(
  courseId: Course["courseId"],
  accessPlansData: AccessPlansData
) {
  try {
    const timestamp = new Date().toISOString();
    
    const plansWithIds = accessPlansData.accessPlans.map((plan) => ({
      ...plan,
      id: uuidv4(),
    }));
    const updateCommand = new UpdateCommand({
      TableName: dynamoTableName,
      Key: {
        PK: "COURSE",
        SK: `COURSE#${courseId}`,
      },
      UpdateExpression: `
        SET accessPlans = list_append(if_not_exists(accessPlans, :emptyList), :newPlans),
            completionStatus.pricing = :hasPricing,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":newPlans": plansWithIds,
        ":emptyList": [],
        ":hasPricing": true,
        ":updatedAt": timestamp,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(updateCommand);

    logger.success("Course access plans updated successfully");
    revalidateTag(`course-${courseId}`);

    return {
      result,
    };
  } catch (error) {
    console.error("Error updating access plans:", error);
    return {
      error,
    };
  }
}
