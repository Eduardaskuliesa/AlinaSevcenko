import { addAssetPlaybackId } from "./addAssetPlaybackId";
import { addLessonDuration } from "./addLessonDuration";
import { createLesson } from "./createLesson";
import { deleteLesson } from "./deleteLesson";
import { getClientLessons } from "./getClientLessons";
import { getLesson } from "./getLesson";
import { getLessons } from "./getLessons";
import { storeBlurPlaceholder } from "./sotreBlurdata";
import { updateLessons } from "./updateLesson";
import { updateLessonOrder } from "./updateLessonOrder";
import { updateLessonStatus } from "./updateLessonStatus";

export const lessons = {
  createLesson,
  getLesson,
  getLessons,
  getClientLessons,
  updateLessonOrder,
  deleteLesson,
  addAssetPlaybackId,
  updateLessons,
  storeBlurPlaceholder,
  addLessonDuration,
  updateLessonStatus,
};
