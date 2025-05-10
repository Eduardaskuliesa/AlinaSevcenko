
"use client";
import React, { useState } from "react";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { categoryActions } from "@/app/actions/category";

import { Category, Language } from "@/app/types/course";
import { CreateDialog } from "./CreateDialog";
import { CategoryList } from "./CategoryList";
import { CategoryFilters } from "./CategoryFilters";

const CategoryPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<Language | "all">("all");

  const { data, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryActions.getCategories(),
  });

  const categories = (data?.categories as Category[]) || [];

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      languageFilter === "all" || category.language === languageFilter;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="p-2 lg:p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          Categories
          {isFetching && <Loader className=" ml-2 h-6 w-6 animate-spin" />}
        </h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      <CategoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
      />

      {isFetching ? (
        <Loader className="animate-spin"></Loader>
      ) : (
        <CategoryList categories={filteredCategories} isLoading={isFetching} />
      )}

      <CreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default CategoryPage;
