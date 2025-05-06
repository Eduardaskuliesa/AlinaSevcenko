"use client";

import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";
import React, { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { coursesAction } from "@/app/actions/coursers";
import { Skeleton } from "@/components/ui/skeleton";

const CourseSettingsPage: React.FC = () => {
  const { courseId } = useGetCourseId();

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
    enabled: !!courseId,
  });

  const plans = courseData?.cousre?.accessPlans || [];
  const [language, setLanguage] = useState<string>(
    courseData?.cousre?.language || "lt"
  );
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  const handleTogglePlan = (id: string, isActive: boolean) => {
    console.log(`Toggling plan ${id} to ${isActive}`);
  };

  const handleEditPlan = (id: string) => {
    console.log(`Editing plan ${id}`);
    // Implementation will be added later
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      console.log(`Deleting plan ${id}`);
      // Implementation will be added later
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-8">
        <div className="flex gap-4">
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
            <span>Save & Publish</span>
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

      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Course plans */}
        <div className="col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isCourseLoading ? (
              Array(2)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg shadow-sm p-6 h-64"
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
                    onToggle={handleTogglePlan}
                    onEdit={handleEditPlan}
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

        {/* Right column - Language settings */}
        <div className="col-span-4">
          <div className="bg-white p-6 border-2 border-primary-light/60 rounded-lg shadow-sm">
            <p className="text-xl font-medium mb-4">Course Language</p>
            {isCourseLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="border-primary-light/60 bg-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lt">Lithuanian (LT)</SelectItem>
                  <SelectItem value="ru">Russian (RU)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <CreatePlanDialog
        open={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
      />
    </div>
  );
};

export default CourseSettingsPage;
