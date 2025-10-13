import { useCoursePlayerStore } from "@/app/store/useCoursePlayerStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface CustomControlsProps {
  courseId: string;
  userId: string;
  showCustomControls: boolean;
}

const CustomControls = ({
  courseId,
  userId,
  showCustomControls,
}: CustomControlsProps) => {
  const { setIsLessonChanging, nextLesson, previousLesson } =
    useCoursePlayerStore();
  return (
    <AnimatePresence>
      {showCustomControls && (
        <>
          <motion.div
            onClick={() => {
              setIsLessonChanging(true);
              previousLesson(courseId, userId);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute hover:cursor-pointer hover:bg-primary/90 flex items-center justify-center bg-primary rounded-md border border-secondary top-[40%] left-0 w-8 h-12 z-10"
          >
            <ChevronLeft className="h-20 w-20" />
          </motion.div>
          <motion.div
            onClick={() => {
              setIsLessonChanging(true);
              nextLesson(courseId, userId);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute hover:cursor-pointer hover:bg-primary/90 flex items-center justify-center bg-primary rounded-md border border-secondary top-[40%] right-0 w-8 h-12 z-10"
          >
            <ChevronRight className="h-20 w-20" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomControls;
