import { createPurchasedCourse } from "./createEnrolledCourse";
import { getCourse } from "./getCourse";
import { getUsersCourses } from "./getCourses";
import { getLearningData } from "./getLearningData";
import { getLessons } from "./getLessons";
import { syncCourseAction } from "./syncCourse";
import { updateEnrollmentCount } from "./updateEnrollmentCount";
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
};
