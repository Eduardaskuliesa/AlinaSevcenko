import { useLessonStore } from "@/app/store/useLessonStore";
import React, { useState } from "react";
import LessonTitle from "./LessonTitle";
import LessonShortDescription from "./LessonShortDescription";
import LessonAccessType from "./LessonAccessType";
import { Loader } from "lucide-react";

const LessonsBasicInfo = () => {
  const { selectedLesson, selectedLessonId, updateLesson, hydrated } =
    useLessonStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { title: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { shortDescription: value });
    }
  };

  const handleAccessTypeChange = (isFree: boolean) => {
    setIsFreePreview(isFree);
    if (selectedLessonId) {
      updateLesson(selectedLessonId, { isFreePreview: isFree });
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
          <LessonTitle initialValue={title} onChange={handleTitleChange} />
          <LessonShortDescription
            initialValue={description}
            onChange={handleDescriptionChange}
          />
          <LessonAccessType
            initialValue={isFreePreview}
            onChange={handleAccessTypeChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <p className="text-gray-500 mb-2">
            Select a lesson from the list to edit its details.
          </p>
          <p className="text-gray-400 text-sm">
            Or add a new lesson using the "Add new lesson" button.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonsBasicInfo;
