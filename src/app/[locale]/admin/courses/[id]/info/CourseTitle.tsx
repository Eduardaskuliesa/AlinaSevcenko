import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface CourseTitleProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const CourseTitle: React.FC<CourseTitleProps> = ({
  initialValue = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 lg:mb-8">
      <Label
        htmlFor="title"
        className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary  w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <BookOpen  className="text-white h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        Course Title
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Input
          id="title"
          placeholder="Enter course title"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 lg:h-14 px-4 text-sm lg:text-base bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CourseTitle;
