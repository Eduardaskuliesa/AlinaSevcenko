"use server";
import { Lesson } from "@/app/types/course";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { fetchLessons } from "@/app/actions/coursers/lesson/getClientLessons";
import { verifyPurchase } from "@/app/actions/enrolled-course/verifyPurschase";
import { logger } from "@/app/utils/logger";

async function canWatch(playbackId: string, courseId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN") return true;

  const lessons = (await fetchLessons(courseId)) ?? [];
  const lesson = lessons.find((l) => l.playbackId === playbackId);
  if (!lesson) return false;
  if (lesson.isPreview) return true;

  const userId = session?.user?.id;
  if (!userId) return false;
  return (await verifyPurchase(userId, courseId)).hasAccess;
}

export async function createSignToken(
  playbackId: Lesson["playbackId"],
  courseId: string
) {
  if (!playbackId || !courseId || !(await canWatch(playbackId, courseId))) {
    logger.error(`Denied playback token for ${playbackId} in ${courseId}`);
    return undefined;
  }

  const secret = process.env.MUX_SIGNING_KEY_SECRET || "";
  const keyId = process.env.MUX_SIGNING_KEY_ID || "";
  const decodedSecret = Buffer.from(secret, "base64").toString("ascii");
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;

  const sign = (aud: "v" | "s" | "t") =>
    jwt.sign({ sub: playbackId, aud, exp, kid: keyId }, decodedSecret, {
      algorithm: "RS256",
    });

  try {
    return {
      playbackToken: sign("v"),
      storyboardToken: sign("s"),
      thumbnailToken: sign("t"),
    };
  } catch (error) {
    console.error("Error creating token", error);
  }
}
