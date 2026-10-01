import { getUsersCourses } from "./getCourses";
import { getLearningData } from "./getLearningData";
import { getLessonProgress } from "./getLessonProgress";
import { getLessons } from "./getLessons";
import { syncCourseAction } from "./syncCourse";
import { updateLessonProgress } from "./updateLessonProgress";

export const enrolledCourseActions = {
  getLessons,
  getUsersCourses,
  getLearningData,
  syncCourseAction,
  updateLessonProgress,
  getLessonProgress,
};
