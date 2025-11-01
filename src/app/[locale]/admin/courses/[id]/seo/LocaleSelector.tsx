import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/app/types/course";

interface LocaleSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
}

const LocaleSelector = ({ value, onChange }: LocaleSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lt">Lithuanian</SelectItem>
        <SelectItem value="ru">Russian</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LocaleSelector;
