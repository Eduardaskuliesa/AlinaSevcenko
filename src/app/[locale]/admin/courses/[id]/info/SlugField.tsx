/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchCheck } from "lucide-react";

interface CourseTitleProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const CourseTitle: React.FC<CourseTitleProps> = ({
  initialValue = "",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue) {
      const normalized = normalizeSlug(initialValue);
      setInputValue(normalized);
      onChange(normalized);
    }
  }, [initialValue]);

  const normalizeSlug = (value: string): string => {
    return value
      .normalize("NFD") // Normalize Unicode (decompose accented chars)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics/accents
      .replace(/[^\w\s-]/g, "") // Remove special characters except whitespace and hyphens
      .trim() // Remove leading/trailing whitespace
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const normalized = normalizeSlug(value);
    setInputValue(normalized);
    onChange(normalized);
  };

  return (
    <div className="mb-4 lg:mb-8">
      <Label
        htmlFor="title"
        className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <SearchCheck className="text-white h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        Course Slug
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Input
          id="title"
          placeholder="course-slug"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 lg:h-14 px-4 text-sm lg:text-base bg-white"
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CourseTitle;
