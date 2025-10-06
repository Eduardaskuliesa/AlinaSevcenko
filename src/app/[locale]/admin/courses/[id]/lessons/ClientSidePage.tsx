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
import React, { useState, useRef, useEffect } from "react";
import DragAndDropLessons from "./DragAndDropLessons";

import LessonsBasicInfo from "./LessonsBasicInfo";
import { useLessonStore } from "@/app/store/useLessonStore";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { SaveActionState } from "@/app/types/actions";
import { coursesAction } from "@/app/actions/coursers";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const ClientLessonPage: React.FC = () => {
  const { addLesson, lessons, markAllSaved } = useLessonStore();
  const { courseId } = useGetCourseId();
  const [isStateAction, setIsStateAction] = useState<SaveActionState>("idle");

  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });
  const course = courseData?.cousre;

  const courseIsPublished = course?.isPublished || false;
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();

  const [isSticky, setIsSticky] = useState(false);
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (actionButtonsRef.current && placeholderRef.current) {
        const containerRect = placeholderRef.current.getBoundingClientRect();
        if (containerRect.top <= 80) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            <InfoIcon className="h-5 w-5 text-yellow-500 animate-icon-warning" />
          ),
        });
        return { success: true };
      }
      if (lessonsToSave.some((lesson) => lesson.isDirty)) {
        const lessonOrder = lessons.map((lesson) => ({
          lessonId: lesson.lessonId,
          sort: lesson.order || 0,
          isPreview: lesson.isPreview,
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

        const lessonToUpdate = lessonsToSave.map((lesson) => ({
          lessonId: lesson.lessonId,
          ...(lesson.title !== undefined && { title: lesson.title }),
          ...(lesson.shortDesc !== undefined && {
            shortDesc: lesson.shortDesc,
          }),
          ...(lesson.isPreview !== undefined && {
            isPreview: lesson.isPreview,
          }),
        }));

        console.log("Lessons to update:", lessonToUpdate);

        if (lessonToUpdate.length > 0) {
          const updateLessonsResult = await coursesAction.lessons.updateLessons(
            courseId,
            lessonToUpdate
          );

          if (updateLessonsResult.error) {
            console.error("Error updating lessons", updateLessonsResult.error);
            toast.error("Failed to update lessons");
            return { success: false };
          }
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
      const result = await coursesAction.courses.publishCourse(
        courseId,
        isPublished
      );
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
    <div className="max-w-7xl mx-auto  lg:px-0">
      {/* Placeholder for sticky behavior */}
      <div ref={placeholderRef} className="h-24 md:h-12 mb-4 lg:mb-8">
        <div
          ref={actionButtonsRef}
          className={`w-full py-2 lg:py-4 z-10 ${
            isSticky
              ? "bg-white lg:bg-transparent fixed lg:relative top-[4rem] lg:top-0 left-0 right-0 shadow-md lg:shadow-none  md:px-10 lg:px-0"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex px-2 flex-col md:flex-row justify-between gap-4">
              <div className="order-2 md:order-1">
                <Button
                  onClick={handleAddLesson}
                  className="flex h-8 lg:h-10 items-center gap-2 w-1/2 md:w-auto"
                  variant="outline"
                >
                  {isStateAction === "adding-lesson" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Adding lesson...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Add new lesson</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex order-1 md:order-2 md:justify-end gap-2 lg:gap-4">
                <Button
                  onClick={() => {
                    setIsStateAction("saving");
                    handleSave();
                  }}
                  disabled={isStateAction !== "idle"}
                  variant="outline"
                  className="flex h-8 lg:h-10 items-center gap-2"
                >
                  {isStateAction === "saving" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
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
                  className="flex h-8 lg:h-10 items-center gap-2"
                >
                  {isStateAction === "saving-and-continuing" ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight size={16} />
                      <span>Save & Continue</span>
                    </>
                  )}
                </Button>
                {course?.isPublished ? (
                  <Button
                    className="flex h-8 lg:h-10 items-center gap-2 text-white"
                    onClick={() => {
                      setIsStateAction("unpublishing");
                      handlePublish(false);
                    }}
                    disabled={isStateAction !== "idle"}
                  >
                    {isStateAction === "unpublishing" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Unpublishing...</span>
                      </>
                    ) : (
                      <>
                        <CircleXIcon size={16} />
                        <span>Unpublish</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="flex items-center h-8 lg:h-10 gap-2 bg-primary text-white hover:bg-primary/90"
                    onClick={() => {
                      setIsStateAction("publishing");
                      handlePublish(true);
                    }}
                    disabled={isStateAction !== "idle"}
                  >
                    {isStateAction === "publishing" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Publish</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  xl:flex-row gap-6">
        <DragAndDropLessons courseIsPublished={courseIsPublished} />
        <LessonsBasicInfo courseIsPublished={courseIsPublished} />
      </div>
    </div>
  );
};

export default ClientLessonPage;
