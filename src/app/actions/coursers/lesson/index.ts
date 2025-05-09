import { addAssetPlaybackId } from "./addAssetPlaybackId";
import { addLessonDuration } from "./addLessonDuration";
import { createLesson } from "./createLesson";
import { deleteLesson } from "./deleteLesson";
import { getLesson } from "./getLesson";
import { getLessons } from "./getLessons";
import { updateLessons } from "./updateLesson";
import { updateLessonOrder } from "./updateLessonOrder";

export const lessons = {
  createLesson,
  getLesson,
  getLessons,
  updateLessonOrder,
  deleteLesson,
  addAssetPlaybackId,
  updateLessons,
  addLessonDuration,
};
