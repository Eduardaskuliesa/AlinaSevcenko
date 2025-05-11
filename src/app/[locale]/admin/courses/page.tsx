import React from "react";
import CoursePageWrapper from "./CoursePageWrapper";
export const dynamic = "force-static";

const CoursePage = () => {
  return (
    <div className="px-2 xl:p-6 space-y-6 max-w-7xl">
      <CoursePageWrapper />
    </div>
  );
};

export default CoursePage;
