import { createAccessPlan } from "./createAccessPlan";
import { createCourse } from "./createCourse";
import { deleteAccessPlan } from "./deleteAcessPlan";
import { getCourse } from "./getCoures";
import { publishCourse } from "./publishCourse";
import { toggleAccessPlanStatus } from "./updateAccessPlanStatus";
import { updateCourseInfo } from "./updateCourseInfo";
import { updateLanguage } from "./updateCourseLanguge";

export const courses = {
  publishCourse,
  createCourse,
  updateCourseInfo,
  getCourse,
  deleteAccessPlan,
  createAccessPlan,
  toggleAccessPlanStatus,
  updateLanguage,
};
