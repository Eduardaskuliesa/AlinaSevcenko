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
          <div
            key={i}
            className="flex space-x-4 animate-pulse border-b border-primary pb-4"
          >
            <div className="min-w-[300px] h-[170px] bg-gray-300 rounded-lg"></div>
            <div className="flex w-full flex-col justify-between">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-300 rounded w-44"></div>
                  <div className="h-7 w-32 bg-gray-300 rounded-full"></div>
                </div>

                <div className="h-4 bg-gray-300 rounded w-[70%]"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-gray-300 rounded-md"></div>
                  <div className="h-5 w-12 bg-gray-300 rounded-md"></div>
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
        {courses.map((course: FilteredCourse) => (
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
