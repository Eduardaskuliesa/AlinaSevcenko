import { createPurchasedCourse } from "./createEnrolledCourse";
import { getCourse } from "./getCourse";
import { getLessons } from "./getLessons";
import { updateEnrollmentCount } from "./updateEnrollmentCount";

export const enrolledCourseActions = {
  createPurchasedCourse,
  updateEnrollmentCount,
  getLessons,
  getCourse,
};
