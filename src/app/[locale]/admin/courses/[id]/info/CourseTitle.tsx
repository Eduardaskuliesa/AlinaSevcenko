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
    <div className="mb-8">
      <Label
        htmlFor="title"
        className="text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <BookOpen size={16} className="text-white" />
        </div>
        Course Title
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Input
          id="title"
          placeholder="Enter course title"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 px-4 text-base bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CourseTitle;
