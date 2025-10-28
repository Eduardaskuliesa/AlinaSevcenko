import { emailActions } from "@/app/actions/email";
import { userActions } from "@/app/actions/user";
import { withWorkerAuth } from "@/app/lib/withWorkerAuth";
import { CartItem } from "@/app/types/cart";
import { Language } from "@/app/types/course";
import { logger } from "@/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

type SendCartReminderRequestBody = {
  userId: string;
  cartItems: CartItem[];
  reminderType: "cart-abandonment";
};

export async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    logger.success("Send cart reminder webhook invoked");
    const { userId, cartItems, reminderType } =
      (await req.json()) as SendCartReminderRequestBody;

    if (!userId || !cartItems || cartItems.length === 0 || !reminderType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [preferences, user] = await Promise.all([
      userActions.preferences.getPreferences(userId),
      userActions.authentication.getUser(userId),
    ]);

    if (!user || !preferences) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.email as string;
    const language = preferences?.preferences.languge as Language;

    const sendEmail = await emailActions.transactional.sendCartReminder({
      email,
      language,
    });

    if (sendEmail.error) {
      return NextResponse.json(
        { error: "Failed to send cart reminder email" },
        { status: 500 }
      );
    }

    logger.success(`Cart reminder email sent successfully to :${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in send cart reminder webhook:", error);
    return NextResponse.json(
      { error: "Failed to send cart reminder" },
      { status: 500 }
    );
  }
}

export const POST = withWorkerAuth(handler);
