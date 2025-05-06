import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/app/types/course";
import { categoryActions } from "@/app/actions/category";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "lt" as Language,
  });

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await categoryActions.createCategory({
        title: formData.title,
        description: formData.description,
        languge: formData.language,
      });

      if (result.success) {
        toast.success("Category created successfully");
        onOpenChange(false);
        setFormData({ title: "", description: "", language: "lt" });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast.error(result.error || "Failed to create category");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="mb-2" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="language">
              Language
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value: Language) =>
                setFormData({ ...formData, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lt">Lithuanian</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              disabled={isLoading}
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Creating..." : "Create"}{" "}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
