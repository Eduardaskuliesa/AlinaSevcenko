"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Settings, BookOpen, MoreVertical, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompletionStatus {
  title: boolean;
  description: boolean;
  price: boolean;
  category: boolean;
  lessons: boolean;
  thumbnail: boolean;
}

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    price: number;
    isPublished: boolean;
    imageUrl: string;
    category: string;
    language?: string;
    completionStatus: CompletionStatus;
    completionPercentage: number;
    canBePublished: boolean;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isPublished, setIsPublished] = useState(course.isPublished);

  const handlePublishToggle = () => {
    if (!course.canBePublished) return;
    setIsPublished(!isPublished);
  };

  const totalSteps = Object.keys(course.completionStatus).length;
  const completedSteps = Object.values(course.completionStatus).filter(
    Boolean
  ).length;

  return (
    <Card className="overflow-hidden pt-0 pb-6 flex flex-col h-full">
      <div className="relative aspect-video">
        <Image
          src={course.imageUrl || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className="bg-secondary/80 backdrop-blur-sm font-medium"
          >
            {course.category}
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

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground">
            ${course.price.toFixed(2)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-secondary/90">
              <BookOpen className="mr-2 h-4 w-4" />
              Lessons
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-red-100 hover:text-red-600 group">
              <Trash className="mr-2 h-4 w-4 group-hover:text-red-600" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={isPublished ? "default" : "outline"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>

          {/* Simplified completion status */}
          {completedSteps === totalSteps ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Ready to publish
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              {completedSteps}/{totalSteps} completed
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center space-x-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="bg-white" asChild>
                <div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={handlePublishToggle}
                    id={`publish-${course.id}`}
                    disabled={!course.canBePublished}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="bg-gray-200"
              >
                {!course.canBePublished
                  ? `Complete all steps to publish (${completedSteps}/${totalSteps})`
                  : isPublished
                  ? "Unpublish course"
                  : "Publish course"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <label
            htmlFor={`publish-${course.id}`}
            className={`text-sm cursor-pointer ${
              !course.canBePublished ? "text-muted-foreground" : ""
            }`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </label>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <BookOpen className="h-4 w-4 mr-1" />
            Lessons
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
