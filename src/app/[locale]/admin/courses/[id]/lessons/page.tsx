"use client";

import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Send, PlusCircle } from "lucide-react";
import React from "react";
import DragAndDropLessons from "./DragAndDropLessons";

import LessonsBasicInfo from "./LessonsBasicInfo";
import { useLessonStore } from "@/app/store/useLessonStore";

const LessonPage: React.FC = () => {
  const { addLesson, lessons } = useLessonStore();

  const handleAddLesson = () => {
    addLesson({
      title: `New Lesson ${lessons.length + 1}`,
      shortDescription: "Add a short description",
      videoUrl: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between  mb-8 gap-4">
        <div className="flex justify-start">
          <Button
            onClick={handleAddLesson}
            size="lg"
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle size={18}></PlusCircle>
            <span>Add new lesson</span>
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Save size={18} />
            <span>Save</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Save size={18} />
            <ArrowRight size={18} />
            <span>Save & Continue</span>
          </Button>
          <Button
            size="lg"
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Send size={18} />
            <span>Publish</span>
          </Button>
        </div>
      </div>
      <div className="flex gap-6">
        <DragAndDropLessons />
        <LessonsBasicInfo />
      </div>
    </div>
  );
};

export default LessonPage;
