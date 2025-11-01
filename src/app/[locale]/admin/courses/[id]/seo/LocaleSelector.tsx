import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/app/types/course";
import { Globe } from "lucide-react";

interface LocaleSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
}

const LocaleSelector = ({ value, onChange }: LocaleSelectorProps) => {
  return (
    <div className="flex flex-col">
      <div className="text-sm lg:text-base font-semibold flex items-center gap-2 mb-2">
        <div className="bg-primary  w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <Globe className="text-white h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        Language
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-white border-2 focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all rounded-lg">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="lt">Lithuanian</SelectItem>
          <SelectItem value="ru">Russian</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocaleSelector;
