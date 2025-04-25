import { useLessonStore } from "@/app/store/useLessonStore";
import React from "react";

const LessonsBasicInfo = () => {
  const { selectedLesson } = useLessonStore();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[500px] w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Lesson Preview</h2>
      {selectedLesson ? (
        <div>
          <h3 className="text-lg font-medium mb-2">{selectedLesson.title}</h3>
          <p className="text-gray-500">
            Preview content for {selectedLesson.title}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Select a lesson to preview its content.</p>
      )}
    </div>
  );
};

export default LessonsBasicInfo;
