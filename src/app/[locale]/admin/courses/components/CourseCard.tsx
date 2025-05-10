"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Settings,
  BookOpen,
  MoreVertical,
  Trash,
  Clock,
  Loader,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Course } from "@/app/types/course";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { coursesAction } from "@/app/actions/coursers";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const locale = pathSegments[1];

  const baseUrl = `/${locale}/admin/courses`;

  const categoriesTitle =
    course.categories && course.categories.length > 0
      ? course.categories.map((category) => category.title).join(", ")
      : "No categories";

  const courseDuration = (course.duration / 60).toFixed(2);

  const handlePublish = async (isPublished: boolean) => {
    setIsPublishing(true);

    const toastId = toast.loading(
      isPublished ? "Publishing course..." : "Unpublishing course..."
    );

    try {
      const result = await coursesAction.courses.publishCourse(
        course.courseId,
        isPublished
      );

      if (result.error === "COURSE_PUBLISHED") {
        toast.error("Course is already published. Cannot update course info.", {
          id: toastId,
        });
        return;
      }

      if (result.error === "COURSE_NOT_FOUND") {
        toast.error("Course not found", { id: toastId });
        return;
      }

      if (result.error === "COURSE_NOT_COMPLETED") {
        toast.error("Course is not completed yet", { id: toastId });
        return;
      }

      if (result.error) {
        toast.error("Failed to update course status", { id: toastId });
        return;
      }

      if (result.success) {
        toast.success(
          isPublished
            ? "Course published successfully"
            : "Course unpublished successfully",
          { id: toastId }
        );
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      toast.error("Error updating course status", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const deletedCourse = await coursesAction.courses.deleteCourse(
        course.courseId
      );

      if (deletedCourse.error) {
        console.log(deletedCourse.error);
        toast.error(deletedCourse.message || "Failed to delete course");
      }

      if (deletedCourse.success) {
        toast.success("Course deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden pt-0 pb-6  gap-4 flex flex-col h-full">
        <div className="relative aspect-video">
          <Image
            src={course.thumbnailImage || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover object-center"
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className="bg-secondary/80 backdrop-blur-sm font-medium"
            >
              {categoriesTitle}
            </Badge>
          </div>
          {course.language && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="outline"
                className="bg-primary/80 text-primary-foreground backdrop-blur-sm font-medium uppercase"
              >
                {course.language}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-2 xxs:px-6 md:px-2 lg:px-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight line-clamp-1">
              {course.title}
            </h3>
            <div className="flex flex-col text-sm text-muted-foreground gap-3">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessonCount} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{courseDuration} minutes</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
              <Link
                href={`${baseUrl}/${course.courseId}/info`}
                className="w-full"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
                  <Pencil className="mr-2 h-4 w-4" />
                  Info
                </DropdownMenuItem>
              </Link>
              <Link
                href={`${baseUrl}/${course.courseId}/settings`}
                className="w-full"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <Link
                href={`${baseUrl}/${course.courseId}/lessons`}
                className="w-full"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lessons
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:bg-red-100 hover:text-red-600 group"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4 group-hover:text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardFooter className="flex items-center justify-between mt-auto pt-4 px-2 xxs:px-6 md:px-2 lg:px-6">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="bg-white" asChild>
                  <div>
                    <Switch
                      checked={course.isPublished}
                      id={`publish-${course.courseId}`}
                      onCheckedChange={(checked) => {
                        handlePublish(checked);
                      }}
                      disabled={isPublishing}
                    />
                  </div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2">
              <label
                htmlFor={`publish-${course.courseId}`}
                className={`text-sm cursor-pointer ${
                  !course.isPublished ? "text-muted-foreground" : ""
                }`}
              >
                {course.isPublished ? "Published" : "Unpublished"}
              </label>
              {isPublishing && <Loader className="h-3 w-3 animate-spin" />}
            </div>
          </div>

          <div className="flex  space-x-2">
            <Link href={`${baseUrl}/${course.courseId}/info`}>
              <Button size="sm" variant="outline">
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Link href={`${baseUrl}/${course.courseId}/lessons`}>
              <Button size="sm" variant="outline">
                <BookOpen className="h-4 w-4 mr-1" />
                Lessons
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Course"
        message={`Are you sure you want to delete "${course.title}"? This action cannot be undone.`}
        handleDeleted={handleDelete}
        isLoading={isDeleting}
        confirmText="Delete"
      />
    </>
  );
};

export default CourseCard;
