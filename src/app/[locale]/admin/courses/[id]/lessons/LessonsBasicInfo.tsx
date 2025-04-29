import { useLessonStore } from "@/app/store/useLessonStore";
import React from "react";
import LessonTitle from "./LessonTitle";
import LessonShortDescription from "./LessonShortDescription";
import LessonAccessType from "./LessonAccessType";
import { Loader } from "lucide-react";
import LessonVideoUpload from "./LessonsVideoUpload";

const LessonsBasicInfo = () => {
  const { selectedLesson, selectedLessonId, updateLesson, hydrated } =
    useLessonStore();

  const handleTitleChange = (value: string) => {
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { title: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { shortDesc: value });
    }
  };

  const handleAccessTypeChange = (preview: boolean) => {
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { isPreview: preview });
    }
  };

  if (!hydrated) {
    return (
      <div className=" h-[500px] w-full p-6 flex flex-col items-center justify-center">
        <Loader size={32} className="animate-spin text-primary mb-4" />
        <p className="text-gray-600 font-medium">Loading lesson editor...</p>
      </div>
    );
  }

  return (
    <div className=" min-h-[500px] w-full px-4 overflow-y-auto">
      {selectedLesson ? (
        <div>
          <LessonTitle
            initialValue={selectedLesson.title}
            onChange={handleTitleChange}
          />
          <LessonShortDescription
            initialValue={selectedLesson.shortDesc || ""}
            onChange={handleDescriptionChange}
          />
          <LessonAccessType
            initialValue={selectedLesson.isPreview || false}
            onChange={handleAccessTypeChange}
          />
          <LessonVideoUpload></LessonVideoUpload>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <p className="text-gray-500 mb-2">
            Select a lesson from the list to edit its details.
          </p>
          <p className="text-gray-400 text-sm">
            Or add a new lesson using the &quot;Add new lesson&quot; button.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonsBasicInfo;
