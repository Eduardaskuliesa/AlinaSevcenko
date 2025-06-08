import { logger } from "@/app/utils/logger";
import Stripe from "stripe";
import { NextResponse } from "next/server";

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

    if (event.type === "checkout.session.completed") {
      const metadata = event.data.object.metadata;
      logger.info(`Metadata: ${JSON.stringify(metadata)}`);

      console.log("Metadata:", metadata);

      const { courseIds, accessIds, userId } = metadata as Stripe.Metadata;
      console.log("User ID:", userId);
      console.log("Course IDs:", courseIds);
      console.log("Access IDs:", accessIds);
    }
    return NextResponse.json({ recieved: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
