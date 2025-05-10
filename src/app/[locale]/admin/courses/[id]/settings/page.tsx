"use client";
import { Button } from "@/components/ui/button";
import { CircleXIcon, InfoIcon, Loader2, Save, Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { CoursePlanCard } from "./PlanCard";
import { AddPlanButton } from "./AddPlanButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePlanDialog } from "./CreatePlanDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { coursesAction } from "@/app/actions/coursers";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { SaveActionState } from "@/app/types/actions";

const CourseSettingsPage: React.FC = () => {
  const { courseId } = useGetCourseId();

  const queryClient = useQueryClient();
  const router = useRouter();

  const [loadingPlanIds, setLoadingPlanIds] = useState<{
    toggle: string | null;
    delete: string | null;
  }>({
    toggle: null,
    delete: null,
  });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    planId: string | null;
  }>({
    isOpen: false,
    planId: null,
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
    enabled: !!courseId,
  });
  const [actionState, setActionState] = useState<SaveActionState>("idle");

  const course = courseData?.cousre;
  const plans = courseData?.cousre?.accessPlans || [];

  const [language, setLanguage] = useState<string>(
    courseData?.cousre?.language || "lt"
  );
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  // Sticky functionality
  const [isSticky, setIsSticky] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (buttonContainerRef.current && placeholderRef.current) {
        const containerRect = placeholderRef.current.getBoundingClientRect();
        if (containerRect.top <= 60) {
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

  const handlePublish = async (isPublished: boolean) => {
    try {
      const result = await coursesAction.courses.publishCourse(
        courseId,
        isPublished
      );

      if (result.error === "COURSE_PUBLISHED") {
        toast.error("Course is already published. Cannot update course info.");
        setActionState("idle");
        return { success: false };
      }
      if (result?.error === "COURSE_NOT_FOUND") {
        toast.error("Course not found");
        setActionState("idle");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return { success: false };
      }
      if (result?.error === "COURSE_NOT_COMPLETED") {
        setActionState("idle");
        toast.error("Course is not completed yet");
        return { success: false };
      }
      if (result?.success) {
        setActionState("idle");
        toast.success("Course published successfully");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
      return { success: true };
    } catch (error) {
      console.error("Error publishing course", error);
      toast.error("Error publishing course");
      return { success: false };
    } finally {
      setActionState("idle");
    }
  };

  const handleSave = async () => {
    setActionState("saving");
    if (language === courseData?.cousre?.language) {
      toast("No changes were made to save", {
        icon: (
          <InfoIcon className="h-5 w-5 text-yellow-500 animate-icon-warning" />
        ),
      });
      setActionState("idle");
      return { success: false };
    }
    try {
      await coursesAction.courses.updateLanguage(courseId, language);
      toast.success("Language updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating language", error);
      toast.error("Error updating language");
      return { success: false };
    } finally {
      setActionState("idle");
    }
  };

  const handleTogglePlan = async (planId: string, isActive: boolean) => {
    setLoadingPlanIds((prev) => ({ ...prev, toggle: planId }));

    try {
      const result = await coursesAction.courses.toggleAccessPlanStatus(
        courseId,
        planId,
        isActive
      );

      if (result.error === "PLAN_NOT_FOUND") {
        toast.error("Plan not found");
        router.refresh();
        return;
      }

      if (result.error === "LAST_PLAN_PUBLISHED") {
        toast.error(
          "Cannot deactivate the last active plan of a published course"
        );
        return;
      }

      if (result.success) {
        toast.success("Plan status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    } catch (error) {
      console.log("Error updating plan status", error);
      toast.error("Error updating plan status");
    } finally {
      setLoadingPlanIds((prev) => ({ ...prev, toggle: null }));
    }
  };

  const handleDeletePlan = (planId: string) => {
    setDeleteModalState({
      isOpen: true,
      planId,
    });
  };

  const confirmDeletePlan = async () => {
    const planId = deleteModalState.planId;
    if (!planId) return;

    setLoadingPlanIds((prev) => ({ ...prev, delete: planId }));

    try {
      const result = await coursesAction.courses.deleteAccessPlan(
        courseId,
        planId
      );
      if (result.error === "COURSE_NOT_FOUND") {
        toast.error("Course not found");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return;
      }

      if (result.error === "PLAN_NOT_FOUND") {
        toast.error("Plan not found");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return;
      }

      if (result.error === "LAST_PLAN_PUBLISHED") {
        toast.error("Cannot delete the last plan of a published course");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return;
      }

      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });

      setDeleteModalState({ isOpen: false, planId: null });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan");
    } finally {
      setLoadingPlanIds((prev) => ({ ...prev, delete: null }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto overflow-hidden px-2 lg:px-0">
      <div ref={placeholderRef} className="h-16 lg:h-20">
        <div
          ref={buttonContainerRef}
          className={`w-full py-2 lg:py-4 px-4 lg:px-0 z-10 ${
            isSticky
              ? "bg-white lg:bg-transparent fixed lg:relative top-[4rem] px-4 lg:top-0 left-0 right-0 shadow-md lg:shadow-none md:px-14"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end gap-2 lg:gap-4">
              <Button
                onClick={handleSave}
                disabled={actionState !== "idle"}
                variant="outline"
                className="flex h-8 lg:h-10 items-center gap-2"
              >
                {actionState === "saving" ? (
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

              {course?.isPublished ? (
                <Button
                  className="flex h-8 lg:h-10 items-center gap-2 text-white"
                  onClick={() => {
                    setActionState("unpublishing");
                    handlePublish(false);
                  }}
                  disabled={actionState !== "idle"}
                >
                  {actionState === "unpublishing" ? (
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
                    setActionState("publishing");
                    handlePublish(true);
                  }}
                  disabled={actionState !== "idle"}
                >
                  {actionState === "publishing" ? (
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

      {/* Reordered content - Language section first on mobile, then pricing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Language settings - full width on mobile, right column on desktop */}
        <div className="md:order-2 md:col-span-4">
          <div className="bg-white xs:w-full sm:w-1/2 md:w-full p-4 md:p-6 border-2 border-primary-light/60 rounded-lg shadow-sm mb-6 md:mb-0">
            <p className="text-lg md:text-xl font-medium mb-3 md:mb-4">
              Course Language
            </p>
            {isCourseLoading ? (
              <Skeleton className="h-9 md:h-10 w-full" />
            ) : (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="border-primary-light/60 bg-white border-2 h-9 md:h-10">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-primary-light/60">
                  <SelectItem value="lt">Lithuanian (LT)</SelectItem>
                  <SelectItem value="ru">Russian (RU)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Pricing plans - full width on mobile, left column on desktop */}
        <div className="md:order-1 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {isCourseLoading ? (
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg shadow-sm p-4 md:p-6 h-48 md:h-64"
                  >
                    <Skeleton className="h-full w-full" />
                  </div>
                ))
            ) : (
              <>
                {plans.map((plan) => (
                  <CoursePlanCard
                    key={plan.id}
                    plan={plan}
                    isToggleLoading={loadingPlanIds.toggle === plan.id}
                    onToggle={handleTogglePlan}
                    onDelete={handleDeletePlan}
                  />
                ))}
                {plans.length < 3 && !isCourseLoading && (
                  <AddPlanButton onClick={() => setIsPlanDialogOpen(true)} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CreatePlanDialog
        open={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
      />

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onOpenChange={(open) =>
          setDeleteModalState((prev) => ({ ...prev, isOpen: open }))
        }
        title="Delete Access Plan"
        message="Are you sure you want to delete this access plan? This action cannot be undone."
        handleDeleted={confirmDeletePlan}
        isLoading={
          deleteModalState.planId
            ? loadingPlanIds.delete === deleteModalState.planId
            : false
        }
      />
    </div>
  );
};

export default CourseSettingsPage;
