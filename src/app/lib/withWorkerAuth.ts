import { NextRequest, NextResponse } from "next/server";

type Handler = (req: NextRequest) => Promise<NextResponse>;

export function withWorkerAuth(handler: Handler): Handler {
  return async (req: NextRequest) => {
    const allowedOrigin = req.headers.get("x-worker-origin");

    if (allowedOrigin !== process.env.WORKER_URL) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403 }
      );
    }

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (token !== process.env.NEXTJS_APP_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req);
  };
}
