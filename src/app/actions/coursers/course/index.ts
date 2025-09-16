import { createAccessPlan } from "./createAccessPlan";
import { createCourse } from "./createCourse";
import { createSlug } from "./createSlug";
import { deleteAccessPlan } from "./deleteAcessPlan";
import { deleteCourse } from "./deleteCourse";
import { getAllCoursesUP } from "./getAllCoursesNP";
import { getCourse } from "./getCourse";
import { getCourseClient } from "./getCourseClient";
import { getCourses } from "./getCourses";
import { publishCourse } from "./publishCourse";
import { toggleAccessPlanStatus } from "./updateAccessPlanStatus";
import { updateCourseInfo } from "./updateCourseInfo";
import { updateCourseSettings } from "./updateCourseLanguge";
import { updateLastPlayedLesson } from "./updateLastPlayedCourse";
import { updateLastWatchedTime } from "./updateLastWatchedTime";
import { updateSlug } from "./updateSlug";

export const courses = {
  publishCourse,
  createCourse,
  updateCourseInfo,
  getCourse,
  getCourseClient,
  getCourses,
  deleteAccessPlan,
  createAccessPlan,
  toggleAccessPlanStatus,
  updateCourseSettings,
  getAllCoursesUP,
  updateLastPlayedLesson,
  updateLastWatchedTime,
  deleteCourse,
  createSlug,
  updateSlug,
};
