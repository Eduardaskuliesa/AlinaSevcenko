import { createAccessPlan } from "./createAccessPlan";
import { createCourse } from "./createCourse";
import { deleteAccessPlan } from "./deleteAcessPlan";
import { deleteCourse } from "./deleteCourse";
import { getCourse } from "./getCourse";
import { getCourses } from "./getCourses";
import { publishCourse } from "./publishCourse";
import { toggleAccessPlanStatus } from "./updateAccessPlanStatus";
import { updateCourseInfo } from "./updateCourseInfo";
import { updateLanguage } from "./updateCourseLanguge";

export const courses = {
  publishCourse,
  createCourse,
  updateCourseInfo,
  getCourse,
  getCourses,
  deleteAccessPlan,
  createAccessPlan,
  toggleAccessPlanStatus,
  updateLanguage,
  deleteCourse,
};
