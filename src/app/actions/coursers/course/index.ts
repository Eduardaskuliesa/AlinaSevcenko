import { createCourse } from "./createCourse";
import { deleteAccessPlan } from "./deleteAcessPlan";
import { getCourse } from "./getCoures";
import { updateAccessPlans } from "./updateAccessPlan";
import { toggleAccessPlanStatus } from "./updateAccessPlanStatus";
import { updateCourseInfo } from "./updateCourseInfo";

export const courses = {
  createCourse,
  updateCourseInfo,
  getCourse,
  deleteAccessPlan,
  updateAccessPlans,
  toggleAccessPlanStatus,
};
