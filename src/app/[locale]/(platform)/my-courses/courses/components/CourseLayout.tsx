import { EnrolledCourse } from "@/app/types/enrolled-course";
import React from "react";
import CourseCard from "./CourseCard";

interface CourseLayoutProps {
  courseData: EnrolledCourse[];
}

const CourseLayout = ({ courseData }: CourseLayoutProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-2 pb-20">
      {courseData.map((course) => (
        <CourseCard key={course.courseId} courseData={course} />
      ))}
    </div>
  );
};

export default CourseLayout;
