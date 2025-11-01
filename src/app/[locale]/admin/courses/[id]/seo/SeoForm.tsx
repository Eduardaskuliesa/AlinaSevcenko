import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, AlignLeft } from "lucide-react";
import React from "react";

interface SeoFormProps {
  formData: {
    metaTitle: string;
    metaDescription: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SeoForm = ({ formData, handleChange }: SeoFormProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-4 lg:mb-8">
        <Label
          htmlFor="metaTitle"
          className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
        >
          <div className="bg-primary  w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
            <BookOpen className="text-white h-4 w-4 lg:h-5 lg:w-5" />
          </div>
          SEO Meta Title
        </Label>
        <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
          <Textarea
            maxLength={90}
            rows={2}
            onChange={handleChange}
            id="metaTitle"
            value={formData.metaTitle}
            placeholder="Enter SEO meta title"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 lg:h-14 px-4 text-sm lg:text-base bg-white"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Label
          htmlFor="metaDescription"
          className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
        >
          <div className="bg-primary w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
            <AlignLeft className="text-white w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          SEO Meta Description
        </Label>
        <div className="text-sm">{formData.metaDescription.length}/160</div>
      </div>

      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Textarea
          rows={3}
          onChange={handleChange}
          value={formData.metaDescription}
          id="metaDescription"
          placeholder="A brief overview of your course"
          className="border-0 text-sm lg:text-base focus-visible:ring-0 focus-visible:ring-offset-0 min-h-24 p-4 bg-white"
          maxLength={160}
        />
      </div>
    </div>
  );
};

export default SeoForm;
