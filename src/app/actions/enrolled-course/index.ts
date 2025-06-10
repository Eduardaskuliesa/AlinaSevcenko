import { createPurchasedCourse } from "./createEnrolledCourse";
import { getCourse } from "./getCourse";
import { getUsersCourses } from "./getCourses";
import { getLessons } from "./getLessons";
import { updateEnrollmentCount } from "./updateEnrollmentCount";

export const enrolledCourseActions = {
  createPurchasedCourse,
  updateEnrollmentCount,
  getLessons,
  getCourse,
  getUsersCourses,
};
