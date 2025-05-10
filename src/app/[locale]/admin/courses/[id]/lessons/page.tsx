"use client";
import { Button } from "@/components/ui/button";
import {
  Save,
  ArrowRight,
  Send,
  PlusCircle,
  Loader2,
  InfoIcon,
  CircleXIcon,
} from "lucide-react";
import React, { useState } from "react";
import DragAndDropLessons from "./DragAndDropLessons";

import LessonsBasicInfo from "./LessonsBasicInfo";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { SaveActionState } from "@/app/types/actions";
import { coursesAction } from "@/app/actions/coursers";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const LessonPage: React.FC = () => {
  const { addLesson, lessons, markAllSaved } = useLessonStore();
  const { courseId } = useGetCourseId();
  const [isStateAction, setIsStateAction] = useState<SaveActionState>("idle");

  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });
  const course = courseData?.cousre;
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const handleAddLesson = async () => {
    setIsStateAction("adding-lesson");
    try {
      const lesson = await coursesAction.lessons.createLesson(courseId);

      if (lesson.error === "COURSE_PUBLISHED") {
        toast.error("Course is already published. Cannot update course info.");
        return;
      }

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
    try {
      const lessonsToSave = lessons.filter((lesson) => lesson.isDirty);
      if (lessonsToSave.length === 0) {
        setIsStateAction("idle");
        toast("No changes were made to save", {
          icon: (
            <InfoIcon
              className="h-5 w-5 text-yellow-500 animate-icon-warning
          "
            />
          ),
        });
        return { success: true };
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

        if (updateOrderResult.error === "COURSE_PUBLISHED") {
          toast.error(
            "Course is already published. Cannot update course info."
          );
          return { success: false };
        }

        if (updateOrderResult.success) {
          toast.success("Lesson order updated successfully");
          queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        } else {
          toast.error("Failed to update lesson order");
          return { success: false };
        }
      }

      markAllSaved();
      return { success: true };
    } catch (error) {
      console.error("Error saving lessons", error);
      toast.error("Error saving lessons");
      return { success: false };
    } finally {
      setIsStateAction("idle");
    }
  };

  const handleSaveAndContinue = async () => {
    const result = await handleSave();
    if (result.success) {
      const nextPath = `/${params.locale}/admin/courses/${courseId}/settings`;
      router.push(nextPath);
    } else {
      setIsStateAction("idle");
    }
  };

  const handlePublish = async (isPublished: boolean) => {
    try {
      const result = await coursesAction.courses.publishCourse(courseId, isPublished);
      if (result?.error === "COURSE_NOT_FOUND") {
        toast.error("Course not found");
        setIsStateAction("idle");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return;
      }
      if (result?.error === "COURSE_NOT_COMPLETED") {
        setIsStateAction("idle");
        toast.error("Course is not completed yet");
        return;
      }
      if (result?.success) {
        setIsStateAction("idle");
        toast.success("Course published successfully");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    } catch (error) {
      console.error("Error publishing course", error);
      toast.error("Error publishing course");
    } finally {
      setIsStateAction("idle");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 lg:px-0">
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
            onClick={() => {
              handleSave();
            }}
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
            onClick={() => {
              handleSaveAndContinue();
              setIsStateAction("saving-and-continuing");
            }}
            disabled={isStateAction !== "idle"}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            {isStateAction === "saving-and-continuing" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <ArrowRight size={18} />
                <span>Save & Continue</span>
              </>
            )}
          </Button>
          {course?.isPublished ? (
            <Button
              size="lg"
              className="flex items-center gap-2 text-white"
              onClick={() => {
                setIsStateAction("unpublishing");
                handlePublish(false);
              }}
              disabled={isStateAction !== "idle"}
            >
              {isStateAction === "unpublishing" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Unpublishing...</span>
                </>
              ) : (
                <>
                  <CircleXIcon size={18} />
                  <span>Unpublish</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setIsStateAction("publishing");
                handlePublish(true);
              }}
              disabled={isStateAction !== "idle"}
            >
              {isStateAction === "publishing" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Publish</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <DragAndDropLessons />
        <LessonsBasicInfo />
      </div>
    </div>
  );
};

export default LessonPage;
