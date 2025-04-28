"use client";

import { Button } from "@/components/ui/button";
import {
  Save,
  ArrowRight,
  Send,
  PlusCircle,
  Loader2,
  InfoIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DragAndDropLessons from "./DragAndDropLessons";

import LessonsBasicInfo from "./LessonsBasicInfo";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { SaveActionState } from "@/app/types/actions";
import { coursesAction } from "@/app/actions/coursers";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const LessonPage: React.FC = () => {
  const { addLesson, lessons, markAllSaved } = useLessonStore();
  const { courseId } = useGetCourseId();
  const [isStateAction, setIsStateAction] = useState<SaveActionState>("idle");
  const queryClient = useQueryClient();


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
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    } catch (error) {
      console.error("Error creating lesson", error);
      toast.error("Error creating lesson");
    } finally {
      setIsStateAction("idle");
    }
  };

  const handleSave = async () => {
    setIsStateAction("saving");
    try {
      const lessonsToSave = lessons.filter((lesson) => lesson.isDirty);
      if (lessonsToSave.length === 0) {
        return toast("No changes were made to save", {
          icon: (
            <InfoIcon
              className="h-5 w-5 text-yellow-500 animate-icon-warning
          "
            />
          ),
        });
      }
      if (lessonsToSave.some((lesson) => lesson.isDirty)) {
        const lessonOrder = lessons.map((lesson) => ({
          lessonId: lesson.lessonId,
          sort: lesson.order || 0,
        }));

        const updateOrderResult = await coursesAction.lessons.updateLessonOrder(
          courseId,
          lessonOrder
        );

        if (updateOrderResult.success) {
          toast.success("Lesson order updated successfully");
          queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        } else {
          toast.error("Failed to update lesson order");
        }
      }
      markAllSaved();
    } catch (error) {
      console.error("Error saving lessons", error);
      toast.error("Error saving lessons");
    } finally {
      setIsStateAction("idle");
    }
  };

  const handleSaveAndContinue = async () => {
    setIsStateAction('saving-and-continuing')
    const result = await handleSave();
  }

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
            onClick={handleSave}
            disabled={isStateAction !== "idle"}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            {isStateAction === "saving" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save</span>
              </>
            )}
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
