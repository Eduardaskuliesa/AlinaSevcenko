"use client";
import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, BookOpen, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const CourseCardSkeleton = () => {
  return (
    <Card className="overflow-hidden pt-0 pb-6 flex flex-col h-full">
      <div className="relative aspect-video">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4 opacity-30" />
        </Button>
      </CardHeader>

      <CardFooter className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center space-x-2">
          <Switch disabled />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" disabled>
            <Pencil className="h-4 w-4 mr-1 opacity-30" />
            <span className="opacity-30">Edit</span>
          </Button>
          <Button size="sm" variant="outline" disabled>
            <BookOpen className="h-4 w-4 mr-1 opacity-30" />
            <span className="opacity-30">Lessons</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
