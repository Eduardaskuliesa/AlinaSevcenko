import { createAccessPlan } from "./createAccessPlan";
import { createCourse } from "./createCourse";
import { deleteAccessPlan } from "./deleteAcessPlan";
import { getCourse } from "./getCoures";
import { toggleAccessPlanStatus } from "./updateAccessPlanStatus";
import { updateCourseInfo } from "./updateCourseInfo";
import { updateLanguage } from "./updateCourseLanguge";

export const courses = {
  createCourse,
  updateCourseInfo,
  getCourse,
  deleteAccessPlan,
  createAccessPlan,
  toggleAccessPlanStatus,
  updateLanguage,
};
