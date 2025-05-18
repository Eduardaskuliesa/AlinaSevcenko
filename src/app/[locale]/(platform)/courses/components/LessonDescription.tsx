import { Course } from "@/app/types/course";
import React from "react";

const LessonDescription = ({ courseData }: { courseData: Course }) => {
  return (
    <div className="mt-2 border-b-2 border-primary pb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Description</h2>
      <p>{courseData.description}</p>
    </div>
  );
};

export default LessonDescription;
