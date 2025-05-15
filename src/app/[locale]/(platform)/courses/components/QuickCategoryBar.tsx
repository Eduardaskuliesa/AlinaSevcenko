"use client";
import { categoryActions } from "@/app/actions/category";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface QuickCategoryBarProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const QuickCategoryBar = ({ setSelectedCategories }: QuickCategoryBarProps) => {
  const { data: categories, isFetching } = useQuery({
    queryKey: ["client-categories"],
    queryFn: () => categoryActions.getAllCategoriesUP(),
  });

  const setCategory = (categoryId: string) => {
    setSelectedCategories([categoryId]);
  };

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 shadow-sm">
        <div className="flex flex-row items-center gap-5 overflow-x-auto border-b border-primary-light py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="relative flex items-center"
            >
              <div className="animate-pulse flex items-center">
                <div className="h-7 w-24 bg-gray-300 rounded whitespace-nowrap px-4 py-2"></div>
                {index < 5 && (
                  <div className="absolute -right-4 top-0 h-full w-8 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-8 -translate-x-4 transform rotate-45 border-r border-t border-gray-200"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 shadow-sm">
      <div className="flex flex-row items-center gap-5 overflow-x-auto border-b border-primary-light">
        {categories?.categories.map((category, index) => (
          <div
            key={category.categoryId}
            className="relative group flex items-center"
          >
            <button
              onClick={() => setCategory(category.categoryId)}
              className="relative cursor-pointer group-hover:text-primary whitespace-nowrap px-4 py-2 text-gray-800"
            >
              {category.title}

              {index < categories.categories.length - 1 && (
                <div className="absolute -right-4 top-0 h-full w-8 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-8 -translate-x-4 transform rotate-45 border-r border-t border-primary-light"></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickCategoryBar;
