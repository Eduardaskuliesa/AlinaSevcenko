import { coursesAction } from "@/app/actions/coursers";
import { AddAssetPlaybackIdData } from "@/app/actions/coursers/lesson/addAssetPlaybackId";
import { AddDurationData } from "@/app/actions/coursers/lesson/addLessonDuration";
import { passthroughData } from "@/app/actions/mux/upload";
import { mux } from "@/app/services/mux";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  console.log("Received webhook request from Mux");
  const headerPayload = await headers();
  const payload = await req.json();
  const body = JSON.stringify(payload);

  try {
    mux.webhooks.verifySignature(
      body,
      headerPayload,
      process.env.MUX_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = payload;

  switch (type) {
    case "video.asset.created": {
      console.log("Status:", data.status);
      console.log("Lesson ID:", data.passthrough as passthroughData);
      console.log("Asset ID:", data.id);
      console.log("Playback ID:", data.playback_ids[0].id);

      const passthrough = JSON.parse(data.passthrough) as passthroughData;
      const updateData: AddAssetPlaybackIdData = {
        lessonId: passthrough.lessonId,
        courseId: passthrough.courseId,
        assetId: data.id,
        playbackId: data.playback_ids[0].id,
        status: data.status,
      };
      const lesson = await coursesAction.lessons.addAssetPlaybackId(updateData);
      revalidateTag(`lesson-${passthrough.lessonId}`);
      if (!lesson.success) {
        return new Response("Error updating lesson", { status: 200 });
      }

      break;
    }
    case "video.asset.ready": {
      console.log("Status:", data.status);
      console.log("Duration:", data.duration);
      console.log("Lesson ID:", data.passthrough as passthroughData);
      console.log("aspectRatio:", data.aspect_ratio);
      const passthrough = JSON.parse(data.passthrough) as passthroughData;

      const updateData: AddDurationData = {
        lessonId: passthrough.lessonId,
        courseId: passthrough.courseId,
        duration: data.duration,
        status: data.status,
      };
      const lesson = await coursesAction.lessons.addLessonDuration(updateData);
      revalidateTag(`lesson-${passthrough.lessonId}`);
      if (!lesson.success) {
        return new Response("Error updating lesson", { status: 200 });
      }
      break;
    }
    default: {
      break;
    }
  }

  return new Response("", { status: 200 });
}
