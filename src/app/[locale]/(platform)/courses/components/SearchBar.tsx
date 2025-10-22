import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import React from "react";
import { FilterState } from "../CoursePage";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  clearFitlers: () => void;
  isCourseLoading: boolean;
  filteredCourselength: number;
  filters: FilterState;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({
  clearFitlers,
  isCourseLoading,
  filteredCourselength,
  filters,
  handleSearchChange,
}: SearchBarProps) => {
  const t = useTranslations("CoursesPage");

  return (
    <div className="flex flex-col-reverse lg:flex-row">
      <div className="w-[30%] hidden lg:block px-4">
        <Button
          className="cursor-pointer"
          onClick={clearFitlers}
          variant={"outline"}
        >
          {t("clearFilters")}
        </Button>
      </div>
      <div className="w-full lg:w-[70%] flex flex-col lg:flex-row lg:justify-between px-2">
        <div className="relative w-full lg:w-1/2 flex items-center">
          <Search className="absolute left-3 text-gray-400" />
          <Input
            className="border-2 h-10 border-primary-light/60 pl-10"
            placeholder={t("searchPlaceholder")}
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="text-gray-800 justify-end px-1 pt-2">
          {isCourseLoading ? (
            <Loader className="h-5 w-5 animate-spin"></Loader>
          ) : (
            <span>{`${t("filteredCourses")}: ${filteredCourselength || 0}`}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
