import { CartItem } from "@/app/types/cart";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { items, locale, userId } = await req.json();

    const formatDuration = (days: number, locale: string) => {
      if (days === 0) {
        return locale === "ru"
          ? "Пожизненно"
          : locale === "lt"
          ? "Visam gyvenimui"
          : "Lifetime";
      }

      if (days < 30) {
        if (locale === "ru") {
          return days === 1
            ? "1 день"
            : days < 5
            ? `${days} дня`
            : `${days} дней`;
        }
        if (locale === "lt") {
          return days === 1 ? "1 diena" : `${days} dienos`;
        }
        return `${days} days`;
      }

      if (days < 365) {
        const months = Math.floor(days / 30);
        if (locale === "ru") {
          return months === 1
            ? "1 месяц"
            : months < 5
            ? `${months} месяца`
            : `${months} месяцев`;
        }
        if (locale === "lt") {
          return months === 1 ? "1 mėnuo" : `${months} mėnesiai`;
        }
        return `${months} months`;
      }

      const years = Math.floor(days / 365);
      if (locale === "ru") {
        return years === 1
          ? "1 год"
          : years < 5
          ? `${years} года`
          : `${years} лет`;
      }
      if (locale === "lt") {
        return years === 1 ? "1 metai" : `${years} metai`;
      }
      return `${years} years`;
    };

    const stripeLocale = locale === "ru" ? "ru" : "lt";
    const session = await stripe.checkout.sessions.create({
      locale: stripeLocale,
      payment_method_types: ["card", "paypal", "revolut_pay"],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: `${
              locale === "ru"
                ? "План доступа"
                : locale === "lt"
                ? "Prieigos planas"
                : "Access plan"
            }: ${formatDuration(item.accessDuration, locale)}`,
          },

          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${req.nextUrl.origin}/${locale}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/${locale}/cart`,
      metadata: {
        courseIds: items.map((item: CartItem) => item.courseId).join(","),
        accessIds: items.map((item: CartItem) => item.accessPlanId).join(","),
        userId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error}` },
      { status: 500 }
    );
  }
}
