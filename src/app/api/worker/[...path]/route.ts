import { AuthError, requireUserId } from "@/app/lib/session";
import { logger } from "@/app/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED: Record<string, string[]> = {
  cart: ["GET"],
  "cart/add": ["POST"],
  "cart/remove": ["DELETE"],
  "cart/clear": ["POST"],
  "cart/update-item": ["PUT"],
  whishlist: ["GET"],
  "whishlist/add": ["POST"],
  "whishlist/remove": ["DELETE"],
};

type Context = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, { params }: Context) {
  const path = (await params).path.join("/");
  if (!ALLOWED[path]?.includes(req.method)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let userId: string;
  try {
    userId = await requireUserId();
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  let body: string | undefined;
  if (req.method !== "GET") {
    const text = await req.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        body = JSON.stringify(
          json && typeof json === "object" && "userId" in json
            ? { ...json, userId }
            : json
        );
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }
  }

  try {
    const res = await fetch(
      `${process.env.WORKER_URL}/${path}?userId=${encodeURIComponent(userId)}`,
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.WORKER_API_KEY || "",
        },
        body,
      }
    );

    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error(`Worker proxy failed for ${path}`, error);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE };
