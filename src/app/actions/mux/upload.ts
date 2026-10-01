"use server";
import { verifyAdminAccess } from "@/app/lib/checkIsAdmin";
import { getAppUrl } from "@/app/lib/appUrl";
import { mux } from "@/app/services/mux";
import { Course, Lesson } from "@/app/types/course";
import { logger } from "@/app/utils/logger";

export interface passthroughData {
  lessonId: Lesson["lessonId"];
  courseId: Course["courseId"];
}

export async function createUploadUrl(
  lessonId: Lesson["lessonId"],
  cousreId: Course["courseId"]
) {
  await verifyAdminAccess();
  try {
    const passthrough = JSON.stringify({
      lessonId: lessonId,
      courseId: cousreId,
    });
    const upload = await mux.video.uploads.create({
      cors_origin: getAppUrl(),

      new_asset_settings: {
        playback_policies: ["signed"],
        passthrough: passthrough,
      },
    });
    if (upload.error) {
      logger.error("Error creating upload:", upload.error.message);
      return {
        success: false,
        message: upload.error.message,
      };
    }

    return {
      success: true,
      uploadUrl: upload.url,
      uploadId: upload.id,
    };
  } catch (error) {
    logger.error("Error creating upload:", error);
    return {
      success: false,
    };
  }
}
