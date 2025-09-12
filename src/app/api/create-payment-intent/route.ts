import { CartItem } from "@/app/types/cart";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems, userId } = await req.json();

    const totalAmount = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      payment_method_types: ["card"],
      currency: "eur",
      metadata: {
        courseIds: cartItems.map((item: CartItem) => item.courseId).join(","),
        accessIds: cartItems
          .map((item: CartItem) => item.accessPlanId)
          .join(","),
        userId: userId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create payment intent: ${error}` },
      { status: 500 }
    );
  }
}
