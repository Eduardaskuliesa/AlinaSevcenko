"use client";

import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Send, PlusCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import DragAndDropLessons from "./DragAndDropLessons";

import LessonsBasicInfo from "./LessonsBasicInfo";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { SaveActionState } from "@/app/types/actions";
import { coursesAction } from "@/app/actions/coursers";
import toast from "react-hot-toast";

const LessonPage: React.FC = () => {
  const { addLesson, lessons } = useLessonStore();
  const { courseId } = useGetCourseId();
  const [isStateAction, setIsStateAction] = useState<SaveActionState>("idle");

  const handleAddLesson = async () => {
    setIsStateAction("adding-lesson");
    try {
      const lesson = await coursesAction.lessons.createLesson(courseId);

      if (lesson.error === "COURSE_NOT_FOUND") {
        toast.error("Course not found");
        return;
      }

      if (lesson.success) {
        addLesson({
          lessonId: lesson.lessonId ?? "",
          title: lesson.title ?? "New Lesson",
          shortDesc: "",
          videoUrl: "",
          duration: 0,
          isPreview: false,
        });
        toast.success("Lesson created successfully");
      }
    } catch (error) {
      console.error("Error creating lesson", error);
      toast.error("Error creating lesson");
    } finally {
      setIsStateAction("idle");
    }
  };

  // const handleSave = async () => {
  //   setIsSaveAction("saving");
  //   try {
  //   } catch (error) {}
  // };

  useEffect(() => {
    console.log(lessons, courseId);
  }, [lessons, courseId]);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between  mb-8">
        <div className="flex justify-start">
          <Button
            onClick={handleAddLesson}
            size="lg"
            variant="outline"
            className="flex items-center gap-2"
          >
            {isStateAction === "adding-lesson" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Adding lesson...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18}></PlusCircle>
                <span>Add new lesson</span>
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-end gap-4">
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
