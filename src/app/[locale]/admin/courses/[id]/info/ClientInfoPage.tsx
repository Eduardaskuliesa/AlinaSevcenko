"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, ArrowRight, Send, Loader, CircleXIcon } from "lucide-react";
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
import { categoryActions } from "@/app/actions/category";
import SlugField from "./SlugField";

const ClientInfoPage: React.FC = () => {
  const params = useParams();
  const courseId = params.id as string;
  const [actionState, setActionState] = useState<SaveActionState>("idle");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId),
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryActions.getCategories(),
  });

  const course = courseData?.cousre;

  const allCategories = (categoriesData?.categories as Category[]) || [];

  const [formData, setFormData] = useState<CourseUpdateInfoData>({
    courseTitle: course?.title || "",
    slug: course?.slug || "",
    slugId: course?.slugId || "",
    shortDescription: course?.shortDescription || "",
    fullDescription: course?.description || "",
    thumbnailSrc: course?.thumbnailImage || "",
    assignedCategories: course?.categories || [],
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseTitle: course.title || "",
        slug: course?.slug || "",
        slugId: course?.slugId || "",
        shortDescription: course.shortDescription || "",
        fullDescription: course.description || "",
        thumbnailSrc: course.thumbnailImage,
        assignedCategories: course.categories || [],
      });
    }
  }, [course]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const assignedCategories = formData.assignedCategories;
  const unassignedCategories = allCategories.filter(
    (category) =>
      !assignedCategories.some(
        (assigned) => assigned.categoryId === category.categoryId
      )
  );

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, courseTitle: value }));
  };

  const handleSlugChange = (value: string) => {
    setFormData((prev) => ({ ...prev, slug: value }));
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
      course?.slug !== formData.slug ||
      course?.shortDescription !== formData.shortDescription ||
      course?.description !== formData.fullDescription ||
      course?.thumbnailImage !== formData.thumbnailSrc ||
      course?.categories?.length !== formData.assignedCategories.length;

    if (!hasFormChanges && !hasThumbnailFileChange) {
      toast("No changes were made to save", {
        icon: (
          <InfoIcon className="h-5 w-5 text-yellow-500 animate-icon-warning" />
        ),
      });
      setActionState("idle");
      return { success: true };
    }

    try {
      const updatedFormData = { ...formData };

      if (!formData.courseTitle) {
        toast.error("Course title can't be empty");
        return { success: false };
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
          if (!response.success && !response.uploadUrl) {
            toast.error("Failed to generate upload URL", {
              id: toastId,
              position: "bottom-right",
            });
            return { success: false };
          }
          artificialDelay(1);
          toast.loading("Uploading to server...", {
            id: toastId,
            position: "bottom-right",
          });

          if (!response.uploadUrl) {
            throw new Error("Upload URL is undefined");
          }

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
          return { success: false };
        }
      }

      const updateResult = await coursesAction.courses.updateCourseInfo(
        updatedFormData,
        courseId
      );

      if (updateResult?.error === "COURSE_PUBLISHED") {
        toast.error("Course is already published. Cannot update course info.");
        setActionState("idle");
        return { success: false };
      }

      if (updateResult?.error === "TITLE_EMPTY") {
        toast.error("Course title can't be empty");
        return { success: false };
      }
      if (updateResult?.error) {
        toast.error("Failed to update course");
        return { success: false };
      }

      const updatedCourse = updateResult?.fieldsUpdate?.Attributes;
      if (updatedCourse) {
        setFormData({
          courseTitle: updatedCourse.title || "",
          slug: updatedCourse.slug || "",
          slugId: updatedCourse.slugId || "",
          shortDescription: updatedCourse.shortDescription || "",
          fullDescription: updatedCourse.description || "",
          thumbnailSrc: updatedCourse.thumbnailImage || "/placeholder.svg",
          assignedCategories: updatedCourse.categories || [],
        });
      }
      setThumbnailFile(null);
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast.success("Course saved successfully!", {});
      return { success: true };
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save course. Please try again.");
      return { success: false };
    } finally {
      setActionState("idle");
    }
  };

  const handleSaveAndContinue = async () => {
    const result = await handleSubmit();
    if (result.success) {
      const nextPath = `/${params.locale}/admin/courses/${courseId}/lessons`;
      router.push(nextPath);
    } else {
      setActionState("idle");
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
        setActionState("idle");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        router.refresh();
        return;
      }
      if (result?.error === "COURSE_NOT_COMPLETED") {
        setActionState("idle");
        toast.error("Course is not completed yet");
        return;
      }
      if (result?.success) {
        setActionState("idle");
        toast.success("Course published successfully");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    } catch (error) {
      console.error("Error publishing course", error);
      toast.error("Error publishing course");
    } finally {
      setActionState("idle");
    }
  };

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

  if (isCourseLoading || isCategoriesLoading || !course) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto  ">
      <div ref={placeholderRef} className="h-16 lg:h-20">
        <div
          ref={buttonContainerRef}
          className={`w-full py-2 lg:py-4 px-2 lg:px-0 z-10 ${
            isSticky
              ? "bg-white  lg:bg-transparent fixed lg:relative top-[4rem] lg:top-0 left-0 right-0 shadow-md lg:shadow-none  md:px-12"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-start lg:justify-end gap-2 lg:gap-4">
              <Button
                variant="outline"
                className="flex h-8 lg:h-10 items-center gap-2"
                onClick={() => {
                  setActionState("saving");
                  handleSubmit();
                }}
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
                className="flex h-8 lg:h-10 items-center gap-2"
                onClick={() => {
                  setActionState("saving-and-continuing");
                  handleSaveAndContinue();
                }}
                disabled={actionState !== "idle"}
              >
                {actionState === "saving-and-continuing" ? (
                  <>
                    <Loader size={18} className="animate-spin" />
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
                  className="flex h-8 lg:h-10 items-center gap-2 text-white"
                  onClick={() => {
                    setActionState("unpublishing");
                    handlePublish(false);
                  }}
                  disabled={actionState !== "idle"}
                >
                  {actionState === "unpublishing" ? (
                    <>
                      <Loader size={18} className="animate-spin" />
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
                  className="flex items-center h-8 lg:h-10 gap-2 bg-primary text-white hover:bg-primary/90"
                  onClick={() => {
                    setActionState("publishing");
                    handlePublish(true);
                  }}
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
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 lg:px-0">
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
            initialUnassignedCategories={unassignedCategories}
            initialAssignedCategories={assignedCategories as Category[]}
            onChange={handleCategoriesChange}
          />
        </div>
        <div>
          <SlugField initialValue={formData.slug} onChange={handleSlugChange} />
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

export default ClientInfoPage;
