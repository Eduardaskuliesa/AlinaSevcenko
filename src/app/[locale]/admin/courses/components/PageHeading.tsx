"use client";
import { categoryActions } from "@/app/actions/category";
import { Category } from "@/app/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Loader, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const PageHeading = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryActions.getCategories(),
  });

  const categories = (data?.categories as Category[]) || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Link href={"courses/create-course"}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 h-10">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8 w-full h-10 border-2 border-primary-light/60 ring-secondary focus-visible:ring-[2px] "
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] border-2 border-primary-light/60 focus-visible:ring-[2px] ring-secondary">
            {isFetching ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <SelectValue placeholder="Category" />
            )}
          </SelectTrigger>
          <SelectContent className="bg-white focus-visible:ring-[2px]">
            <SelectItem
              className="hover:bg-secondary cursor-pointer"
              value="all"
            >
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category.categoryId}
                className="hover:bg-secondary cursor-pointer"
                value={category.categoryId}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PageHeading;
