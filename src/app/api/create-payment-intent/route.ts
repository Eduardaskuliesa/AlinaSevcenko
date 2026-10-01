import { CartLine, priceCart, PricingError } from "@/app/lib/pricing";
import { AuthError, requireUserId } from "@/app/lib/session";
import stripe from "@/app/services/stripe";
import { logger } from "@/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { cartItems } = (await req.json()) as { cartItems: CartLine[] };

    const { priced, totalCents } = await priceCart(cartItems);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        courseIds: priced.map(({ course }) => course.courseId).join(","),
        accessIds: priced.map(({ accessPlan }) => accessPlan.id).join(","),
        userId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof PricingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    logger.error("Failed to create payment intent", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
