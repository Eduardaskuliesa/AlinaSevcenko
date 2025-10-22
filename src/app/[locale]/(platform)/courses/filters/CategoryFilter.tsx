"use client";
import { ArrowDown, Loader } from "lucide-react";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { categoryActions } from "@/app/actions/category";
import { useTranslations } from "next-intl";

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
}: CategoryFilterProps) => {
  const t = useTranslations("CoursesPage");
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["client-categories"],
    queryFn: async () => categoryActions.getAllCategoriesUP(),
  });

  const categories = categoryData?.categories || [];

  const [isOpen, setIsOpen] = useState(true);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="py-4 border-b border-primary-light">
      <div
        className="flex flex-row justify-between w-full items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-xl font-semibold text-gray-800">{t("category")}</p>
        <div
          className={`p-1 bg-primary-light rounded-md transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        >
          {isCategoryLoading ? (
            <Loader className="h-5 w-5 text-gray-800 animate-spin"></Loader>
          ) : (
            <ArrowDown className="h-5 w-5 text-gray-800" />
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col mt-2 space-y-2 pt-2">
              {isCategoryLoading ? (
                <div className="text-sm text-gray-500">
                  {t("loadingCategories")}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {t("noCategoriesAvailable")}
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center space-x-4"
                  >
                    <Checkbox
                      id={`category-${category.categoryId}`}
                      checked={selectedCategories.includes(category.categoryId)}
                      onCheckedChange={() =>
                        toggleCategory(category.categoryId)
                      }
                    />
                    <label
                      htmlFor={`category-${category.categoryId}`}
                      className="text-gray-800 cursor-pointer"
                    >
                      {category.title}
                    </label>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
