import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Tag, Plus, Search } from "lucide-react";
import { Category } from "@/app/types/course";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateDialog } from "../../../categories/CreateDialog";

interface CategorySelectorProps {
  initialUnassignedCategories: Category[];
  initialAssignedCategories: Category[];
  onChange: (assignedCategories: Category[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  initialUnassignedCategories,
  initialAssignedCategories,
  onChange,
}) => {
  const [unassignedCategories, setUnassignedCategories] = useState<Category[]>(
    initialUnassignedCategories
  );

  const [assignedCategories, setAssignedCategories] = useState<Category[]>(
    initialAssignedCategories
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | "lt" | "ru">(
    "all"
  );

  useEffect(() => {
    console.log("Unassigned Categories:", unassignedCategories);
    console.log("Assigned Categories:", assignedCategories);
  }, [unassignedCategories, assignedCategories]);

  useEffect(() => {
    setUnassignedCategories(initialUnassignedCategories);
  }, [initialUnassignedCategories]);

  useEffect(() => {
    setAssignedCategories(initialAssignedCategories);
  }, [initialAssignedCategories]);

  const moveToAssigned = (categoryId: string) => {
    const category = unassignedCategories.find(
      (c) => c.categoryId === categoryId
    );
    if (!category) return;

    const newUnassigned = unassignedCategories.filter(
      (c) => c.categoryId !== categoryId
    );
    const newAssigned = [...assignedCategories, category];

    setUnassignedCategories(newUnassigned);
    setAssignedCategories(newAssigned);
    onChange(newAssigned);
  };

  const moveToUnassigned = (categoryId: string) => {
    const category = assignedCategories.find(
      (c) => c.categoryId === categoryId
    );
    if (!category) return;

    const newAssigned = assignedCategories.filter(
      (c) => c.categoryId !== categoryId
    );
    const newUnassigned = [...unassignedCategories, category];

    setAssignedCategories(newAssigned);
    setUnassignedCategories(newUnassigned);
    onChange(newAssigned);
  };

  const moveAllToAssigned = () => {
    const newAssigned = [...assignedCategories, ...unassignedCategories];
    setAssignedCategories(newAssigned);
    setUnassignedCategories([]);
    onChange(newAssigned);
  };

  const moveAllToUnassigned = () => {
    const newUnassigned = [...unassignedCategories, ...assignedCategories];
    setUnassignedCategories(newUnassigned);
    setAssignedCategories([]);
    onChange([]);
  };

  const filterCategories = (categories: Category[]) => {
    return categories.filter((category) => {
      const matchesSearch = category.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesLanguage =
        languageFilter === "all" || category.language === languageFilter;

      return matchesSearch && matchesLanguage;
    });
  };

  const filteredUnassigned = filterCategories(unassignedCategories);
  const filteredAssigned = filterCategories(assignedCategories);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
            <Tag size={16} className="text-white" />
          </div>
          Course Categories
        </Label>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={16} />
          Create Category
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-2 border-primary-light/40 bg-white"
          />
        </div>
        <Select
          value={languageFilter}
          onValueChange={(value: "all" | "lt" | "ru") =>
            setLanguageFilter(value)
          }
        >
          <SelectTrigger className="w-[150px] h-9 bg-white hover:bg-gray-50 transition-colors border-2 border-primary-light/40" >
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="lt">Lithuanian</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-2 rounded-lg py-4 px-2 bg-white">
        <div className="flex gap-3">
          {/* Unassigned Categories */}
          <div className="flex-1">
            <div className="font-medium mb-2 text-sm text-center">
              <span>Unassigned Categories</span>
            </div>
            <div className="border rounded-md min-h-[280px] max-h-[400px] bg-gray-50 overflow-y-auto">
              {filteredUnassigned.map((category) => (
                <div
                  key={category.categoryId}
                  className="p-3 hover:bg-slate-100 border-b last:border-b-0 cursor-pointer group transition-colors"
                  onClick={() => moveToAssigned(category.categoryId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.language.toUpperCase()}
                      </Badge>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
              {filteredUnassigned.length === 0 && (
                <div className="p-6 text-gray-500 text-sm italic flex justify-center items-center h-full">
                  {searchQuery || languageFilter !== "all"
                    ? "No matching categories found"
                    : "No categories available"}
                </div>
              )}
            </div>
          </div>

          {/* Arrow Buttons Container */}
          <div className="flex flex-col justify-center items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllToAssigned}
              disabled={filteredUnassigned.length === 0}
              className="h-8 w-8 "
              title="Assign all categories"
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllToUnassigned}
              disabled={filteredAssigned.length === 0}
              className="h-8 w-8 "
              title="Unassign all categories"
            >
              <ChevronLeft size={16} />
            </Button>
          </div>

          {/* Assigned Categories */}
          <div className="flex-1">
            <div className="font-medium mb-2 text-sm text-center">
              <span>Assigned Categories</span>
            </div>
            <div className="border rounded-md min-h-[280px] max-h-[400px] bg-gray-50 overflow-y-auto">
              {filteredAssigned.map((category) => (
                <div
                  key={category.categoryId}
                  className="p-3 hover:bg-slate-100 border-b last:border-b-0 cursor-pointer group transition-colors"
                  onClick={() => moveToUnassigned(category.categoryId)}
                >
                  <div className="flex items-center justify-between">
                    <ChevronLeft
                      size={18}
                      className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category?.language?.toUpperCase() || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAssigned.length === 0 && (
                <div className="p-6 text-gray-500 text-sm italic flex justify-center items-center h-full">
                  {searchQuery || languageFilter !== "all"
                    ? "No matching categories found"
                    : "No categories assigned"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default CategorySelector;
