"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import CourseTitle from "./CourseTitle";
import ShortDescription from "./ShortDescription";
import FullDescription from "./FullDescription";
import CategorySelector from "./CategorySelector";
import ThumbnailUploader from "./ThumbnailUploader";
import { Category, CourseUpdateInfoData } from "@/app/types/course";
import { coursesAction } from "@/app/actions/coursers";

const InfoPage: React.FC = () => {
  const defaultUnassignedCategories: Category[] = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "UI/UX Design" },
    { id: 3, name: "Digital Marketing" },
    { id: 4, name: "Business" },
    { id: 5, name: "Programming" },
    { id: 6, name: "Data Science" },
    { id: 7, name: "Mobile Development" },
  ];

  const params = useParams();
  const courseId = params.id as string;
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CourseUpdateInfoData>({
    courseTitle: "",
    shortDescription: "",
    fullDescription: "",
    thumbnailSrc: "/placeholder.svg",
    assignedCategories: [],
  });

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, courseTitle: value }));
  };

  const handleShortDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, shortDescription: value }));
  };

  const handleFullDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, fullDescription: value }));
  };

  const handleThumbnailChange = (thumbnailSrc: string) => {
    setFormData((prev) => ({ ...prev, thumbnailSrc }));
  };

  const handleCategoriesChange = (assignedCategories: Category[]) => {
    setFormData((prev) => ({ ...prev, assignedCategories }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const updateResult = await coursesAction.courses.updateCourseInfo(
        formData,
        courseId
      );
      if (updateResult?.error === "TITLE_EMPTY") {
        return toast.error("Course title can't be empty");
      }
      if(updateResult?.error) {
        return toast.error('Failed to create course')
      }
      toast.success("Course saved successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save course. Please try again.");
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = () => {
    handleSubmit();
    // Navigate to next page or handle continuation logic
  };

  const handlePublish = () => {
    handleSubmit();
    // Additional publish logic
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-8 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader size={18} className="animate-spin" />
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
          onClick={handleSaveAndContinue}
        >
          <Save size={18} />
          <ArrowRight size={18} />
          <span>Save & Continue</span>
        </Button>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
          onClick={handlePublish}
        >
          <Send size={18} />
          <span>Publish</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <CourseTitle
            initialValue={formData.courseTitle}
            onChange={handleTitleChange}
          />

          <ShortDescription
            initialValue={formData.shortDescription}
            onChange={handleShortDescriptionChange}
          />

          <CategorySelector
            initialUnassignedCategories={defaultUnassignedCategories}
            initialAssignedCategories={formData.assignedCategories}
            onChange={handleCategoriesChange}
          />
        </div>
        <div>
          <FullDescription
            initialValue={formData.fullDescription}
            onChange={handleFullDescriptionChange}
          />

          <ThumbnailUploader
            initialThumbnail={formData.thumbnailSrc}
            onChange={handleThumbnailChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
