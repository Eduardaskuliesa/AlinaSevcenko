import React from "react";
import { FilterState } from "../CoursePage";
import DurationFilter from "../filters/DurationFilter";
import LanguageFilter from "../filters/LangugeFilter";
import CategoryFilter from "../filters/CategoryFilter";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterProps {
  filters: FilterState;
  updateCategoryFilter: (category: string[]) => void;
  updateDurationFilter: (duration: string[]) => void;
  updateLanguageFilter: (language: string[]) => void;
  clearFitlers: () => void;
}

const Filter = ({
  filters,
  updateCategoryFilter,
  updateDurationFilter,
  updateLanguageFilter,
  clearFitlers,
}: FilterProps) => {
  const activeFilterCount =
    filters.durations.length +
    filters.languages.length +
    filters.categories.length;

  return (
    <>
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-[60%]">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-sm">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 overflow-y-auto bg-white p-2"
          >
            <SheetHeader className="pt-2 px-0 pb-0 flex justify-center">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <DurationFilter
                selectedDurations={filters.durations}
                setSelectedDurations={updateDurationFilter}
              />
              <LanguageFilter
                selectedLanguages={filters.languages}
                setSelectedLanguages={updateLanguageFilter}
              />
              <CategoryFilter
                selectedCategories={filters.categories}
                setSelectedCategories={updateCategoryFilter}
              />
              <Button
                className="cursor-pointer w-full mt-4"
                onClick={clearFitlers}
                variant={"outline"}
              >
                Clear filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button
          className="cursor-pointer w-auto"
          onClick={clearFitlers}
          variant={"outline"}
        >
          Clear filters
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <DurationFilter
          selectedDurations={filters.durations}
          setSelectedDurations={updateDurationFilter}
        />
        <LanguageFilter
          selectedLanguages={filters.languages}
          setSelectedLanguages={updateLanguageFilter}
        />
        <CategoryFilter
          selectedCategories={filters.categories}
          setSelectedCategories={updateCategoryFilter}
        />
      </div>
    </>
  );
};

export default Filter;
