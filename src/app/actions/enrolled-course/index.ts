import { createPurchasedCourse } from "./createEnrolledCourse";
import { getCourse } from "./getCourse";
import { getUsersCourses } from "./getCourses";
import { getLearningData } from "./getLearningData";
import { getLessonProgress } from "./getLessonProgress";
import { getLessons } from "./getLessons";
import { syncCourseAction } from "./syncCourse";
import { updateEnrollmentCount } from "./updateEnrollmentCount";
import { updateLessonProgress } from "./updateLessonProgress";
import { verifyPurchase } from "./verifyPurschase";

export const enrolledCourseActions = {
  createPurchasedCourse,
  updateEnrollmentCount,
  getLessons,
  getCourse,
  getUsersCourses,
  getLearningData,
  verifyPurchase,
  syncCourseAction,
  updateLessonProgress,
  getLessonProgress,
};
