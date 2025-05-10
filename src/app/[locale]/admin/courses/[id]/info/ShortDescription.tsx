import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";

interface ShortDescriptionProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const ShortDescription: React.FC<ShortDescriptionProps> = ({
  initialValue = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 lg:mb-8">
      <Label
        htmlFor="shortDescription"
        className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2"
      >
        <div className="bg-primary w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <AlignLeft className="text-white w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        Short Description
      </Label>
      <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
        <Textarea
          id="shortDescription"
          placeholder="A brief overview of your course"
          className="border-0  text-sm lg:text-base focus-visible:ring-0 focus-visible:ring-offset-0 min-h-24 p-4  resize-none bg-white"
          value={initialValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ShortDescription;
