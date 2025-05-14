"use client";
import { FilteredCourse } from "@/app/types/course";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: FilteredCourse[];
  isLoading: boolean;
}

const CourseList = ({ courses, isLoading }: CourseListProps) => {
  console.log("Courses:", courses);
  const coursesWithLowestPrices = courses.map((course) => {
    const lowestPrice =
      course.accessPlans && course.accessPlans.length > 0
        ? course.accessPlans
            .map((plan) => plan?.price)
            .reduce((a, b) => Math.min(a, b), Infinity)
        : null;

    return {
      courseId: course.courseId,
      lowestPrice,
    };
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-6 animate-pulse">
            <div className="min-w-[350px] h-[200px] bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mt-auto ml-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 overflow-y-auto">
      {courses.map((course: FilteredCourse) => (
        <CourseCard
          key={course.courseId}
          course={course}
          lowestPrice={
            coursesWithLowestPrices.find((c) => c.courseId === course.courseId)
              ?.lowestPrice || null
          }
        />
      ))}
    </div>
  );
};

export default CourseList;
