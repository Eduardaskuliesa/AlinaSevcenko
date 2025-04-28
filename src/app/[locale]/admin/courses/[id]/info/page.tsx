"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CourseTitle from "./CourseTitle";
import ShortDescription from "./ShortDescription";
import FullDescription from "./FullDescription";
import CategorySelector from "./CategorySelector";
import ThumbnailUploader from "./ThumbnailUploader";
import { Category, CourseUpdateInfoData } from "@/app/types/course";
import { coursesAction } from "@/app/actions/coursers";
import { getPresignedUploadUrl } from "@/app/actions/s3/getPresignedUploadUrl";
import { InfoIcon } from "lucide-react";
import { artificialDelay } from "@/app/utils/artificialDelay";
import { SaveActionState } from "@/app/types/actions";

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
  const [actionState, setActionState] = useState<SaveActionState>("idle");
  const queryClient = useQueryClient();
  const router = useRouter();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });

  const course = data?.cousre;

  const [formData, setFormData] = useState<CourseUpdateInfoData>({
    courseTitle: course?.title || "",
    shortDescription: course?.shortDescription || "",
    fullDescription: course?.description || "",
    thumbnailSrc: course?.thumbnailImage || "/placeholder.svg",
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

  const handleThumbnailFileSelect = (file: File | null) => {
    setThumbnailFile(file);
  };

  const handleCategoriesChange = (assignedCategories: Category[]) => {
    setFormData((prev) => ({ ...prev, assignedCategories }));
  };

  const handleSubmit = async () => {
    const hasThumbnailFileChange = thumbnailFile !== null;
    const hasFormChanges =
      course?.title !== formData.courseTitle ||
      course?.shortDescription !== formData.shortDescription ||
      course?.description !== formData.fullDescription ||
      course?.thumbnailImage !== formData.thumbnailSrc;

    if (!hasFormChanges && !hasThumbnailFileChange) {
      return toast("No changes were made to save", {
        icon: (
          <InfoIcon
            className="h-5 w-5 text-yellow-500 animate-icon-warning
        "
          />
        ),
      });
    }

    setActionState("saving");
    try {
      const updatedFormData = { ...formData };

      if (!formData.courseTitle) {
        return toast.error("Course title can't be empty");
      }

      if (thumbnailFile) {
        const toastId = toast.loading("Generating upload URL...", {
          position: "bottom-right",
        });

        try {
          toast.loading("Generating upload URL...", { id: toastId });
          const response = await getPresignedUploadUrl(
            thumbnailFile.name,
            thumbnailFile.type,
            true
          );
          artificialDelay(1);
          toast.loading("Uploading to server...", {
            id: toastId,
            position: "bottom-right",
          });

          const uploadResult = await fetch(response.uploadUrl, {
            method: "PUT",
            body: thumbnailFile,
            headers: {
              "Content-Type": thumbnailFile.type,
            },
          });

          if (!uploadResult.ok) {
            throw new Error("Failed to upload thumbnail to S3");
          }

          toast.success("Image successfully uploaded to server", {
            id: toastId,
            position: "bottom-right",
          });

          updatedFormData.thumbnailSrc = response.mediaUrl;
        } catch (error) {
          console.error("Error uploading thumbnail:", error);
          toast.error("Failed to upload thumbnail", {
            id: toastId,
            position: "bottom-right",
          });
        }
      }

      const updateResult = await coursesAction.courses.updateCourseInfo(
        updatedFormData,
        courseId
      );

      if (updateResult?.error === "TITLE_EMPTY") {
        return toast.error("Course title can't be empty");
      }
      if (updateResult?.error) {
        return toast.error("Failed to update course");
      }

      const updatedCourse = updateResult?.fieldsUpdate?.Attributes;
      if (updatedCourse) {
        setFormData({
          courseTitle: updatedCourse.title || "",
          shortDescription: updatedCourse.shortDescription || "",
          fullDescription: updatedCourse.description || "",
          thumbnailSrc: updatedCourse.thumbnailImage || "/placeholder.svg",
          assignedCategories: updatedCourse.categories || [],
        });
      }
      setThumbnailFile(null);
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast.success("Course saved successfully!", {});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setActionState("idle");
      return {
        success: true,
      };
    }
  };

  const handleSaveAndContinue = async () => {
    setActionState("saving-and-continuing");
    const result = await handleSubmit();
    if (result) {
      const nextPath = `/${params.locale}/admin/courses/${courseId}/lessons`;
      router.push(nextPath);
    } else {
      setActionState("idle");
    }
  };

  const handlePublish = async () => {
    setActionState("publishing");
    await handleSubmit();
    setActionState("idle");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-8 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={handleSubmit}
          disabled={actionState !== "idle"}
        >
          {actionState === "saving" ? (
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
          disabled={actionState !== "idle"}
        >
          {actionState === "saving-and-continuing" ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Save & Continue</span>
            </>
          ) : (
            <>
              <ArrowRight size={18} />
              <span>Save & Continue</span>
            </>
          )}
        </Button>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
          onClick={handlePublish}
          disabled={actionState !== "idle"}
        >
          {actionState === "publishing" ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Publish</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            onFileSelect={handleThumbnailFileSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
