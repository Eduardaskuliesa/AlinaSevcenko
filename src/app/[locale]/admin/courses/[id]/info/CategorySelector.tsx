import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Tag } from "lucide-react";

export interface Category {
  id: number;
  name: string;
}

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

  const moveToAssigned = (categoryId: number) => {
    const category = unassignedCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const newUnassigned = unassignedCategories.filter(
      (c) => c.id !== categoryId
    );
    const newAssigned = [...assignedCategories, category];

    setUnassignedCategories(newUnassigned);
    setAssignedCategories(newAssigned);
    onChange(newAssigned);
  };

  const moveToUnassigned = (categoryId: number) => {
    const category = assignedCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const newAssigned = assignedCategories.filter((c) => c.id !== categoryId);
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

  return (
    <div className="mb-8">
      <Label className="text-base font-semibold flex items-center gap-2 mb-2">
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
          <Tag size={16} className="text-white" />
        </div>
        Course Categories
      </Label>

      <div className="border-2 rounded-lg p-4 bg-white">
        <div className="flex gap-2 justify-center">
          {/* Unassigned Categories */}
          <div className="w-[45%]">
            <div className="font-medium mb-2 text-sm text-center">
              <span>Unassigned Categories</span>
            </div>
            <div className="border rounded-md h-48 overflow-y-auto">
              {unassignedCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-2.5 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer flex justify-between items-center group"
                  onClick={() => moveToAssigned(category.id)}
                >
                  <span className="text-sm">{category.name}</span>
                  <ChevronRight
                    size={16}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {unassignedCategories.length === 0 && (
                <div className="p-3 text-gray-500 text-xs italic flex justify-center items-center h-full">
                  No categories available
                </div>
              )}
            </div>
          </div>

          {/* Arrow Buttons in Middle */}
          <div className="flex flex-col justify-center items-center gap-3 w-1/12">
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllToAssigned}
              disabled={unassignedCategories.length === 0}
              className="h-8 w-8 p-0"
              title="Assign all categories"
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={moveAllToUnassigned}
              disabled={assignedCategories.length === 0}
              className="h-8 w-8 p-0"
              title="Unassign all categories"
            >
              <ChevronLeft size={16} />
            </Button>
          </div>

          {/* Assigned Categories */}
          <div className="w-[45%]">
            <div className="font-medium mb-2 text-sm text-center">
              <span>Assigned Categories</span>
            </div>
            <div className="border rounded-md h-48 overflow-y-auto">
              {assignedCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-2.5 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer flex justify-between items-center group"
                  onClick={() => moveToUnassigned(category.id)}
                >
                  <ChevronLeft
                    size={16}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
              {assignedCategories.length === 0 && (
                <div className="p-3 text-gray-500 text-xs italic flex justify-center items-center h-full">
                  No categories assigned
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
