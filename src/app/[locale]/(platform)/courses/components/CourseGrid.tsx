"use client";
import { FilteredCourse } from "@/app/types/course";
import CourseCard from "./CourseCard";
import { AnimatePresence, motion } from "motion/react";

interface CourseListProps {
  courses: FilteredCourse[];
  isLoading: boolean;
}

const CourseList = ({ courses, isLoading }: CourseListProps) => {
  const coursesWithLowestPrices = courses.map((course) => {
    const activePlans =
      course.accessPlans?.filter((plan) => plan.isActive) || [];

    const lowestPrice =
      activePlans.length > 0
        ? activePlans
            .map((plan) => plan.price)
            .reduce((a, b) => Math.min(a, b), Infinity)
        : null;

    return {
      courseId: course.courseId,
      lowestPrice,
    };
  });

  const sortedCourses = courses.sort((a, b) => a.sort - b.sort);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row border-b hover:bg-slate-50 px-1 border-primary pb-4 animate-pulse"
          >
            <div className="relative w-full md:min-w-[300px] md:max-w-[300px] h-[250px] sm:h-[300px] md:h-[180px] bg-gray-300 rounded-md"></div>

            <div className="flex flex-col flex-1 justify-between px-4 md:ml-6 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row justify-between w-full mb-auto">
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="flex gap-4 mt-3">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>

                <div className="md:ml-4 md:min-w-[120px] flex justify-start md:justify-end mt-2 md:mt-0">
                  <div className="h-7 w-32 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center w-full mt-4 gap-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-300 rounded-md"></div>
                  <div className="h-5 w-16 bg-gray-300 rounded-md"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 overflow-hidden">
      <AnimatePresence mode="sync">
        {sortedCourses.map((course: FilteredCourse) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <CourseCard
              course={course}
              lowestPrice={
                coursesWithLowestPrices.find(
                  (c) => c.courseId === course.courseId
                )?.lowestPrice || null
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CourseList;
