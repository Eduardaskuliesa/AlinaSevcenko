import "server-only";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, dynamoTableName } from "../services/dynamoDB";
import { AccessPlan, Course } from "../types/course";

export interface CartLine {
  courseId: string;
  accessPlanId: string;
}

export interface PricedLine {
  course: Course;
  accessPlan: AccessPlan;
}

export class PricingError extends Error {}

export async function priceCart(lines: CartLine[]) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new PricingError("EMPTY_CART");
  }

  const seen = new Set<string>();
  const priced: PricedLine[] = [];

  for (const line of lines) {
    if (
      typeof line?.courseId !== "string" ||
      typeof line?.accessPlanId !== "string"
    ) {
      throw new PricingError("INVALID_ITEM");
    }
    if (seen.has(line.courseId)) continue;
    seen.add(line.courseId);

    const { Item } = await dynamoDb.send(
      new GetCommand({
        TableName: dynamoTableName,
        Key: { PK: "COURSE", SK: `COURSE#${line.courseId}` },
      })
    );
    const course = Item as Course | undefined;

    if (!course || !course.isPublished) {
      throw new PricingError("COURSE_UNAVAILABLE");
    }

    const accessPlan = course.accessPlans?.find(
      (plan) => plan.id === line.accessPlanId && plan.isActive
    );
    if (!accessPlan) {
      throw new PricingError("PLAN_UNAVAILABLE");
    }

    priced.push({ course, accessPlan });
  }

  const totalCents = priced.reduce(
    (sum, { accessPlan }) => sum + Math.round(accessPlan.price * 100),
    0
  );

  return { priced, totalCents };
}
