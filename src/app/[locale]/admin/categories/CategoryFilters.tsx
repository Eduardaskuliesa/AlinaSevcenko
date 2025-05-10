import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Language } from "@/app/types/course";

interface CategoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  languageFilter: Language | "all";
  onLanguageChange: (value: Language | "all") => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-col xxs:flex-row gap-4 mb-6">
      <div className="relative flex-1 bg-white">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>
      <Select value={languageFilter} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px] bg-white h-10  hover:bg-gray-50 transition-colors">
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent className="bg-white  border border-primary-light shadow-md">
          <SelectItem value="all" className="hover:bg-gray-100">
            All Languages
          </SelectItem>
          <SelectItem value="lt" className="hover:bg-gray-100">
            Lithuanian
          </SelectItem>
          <SelectItem value="ru" className="hover:bg-gray-100">
            Russian
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
