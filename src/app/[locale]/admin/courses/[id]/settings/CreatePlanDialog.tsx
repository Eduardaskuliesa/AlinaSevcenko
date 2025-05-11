"use client";

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
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, CreditCard, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccessPlansData } from "@/app/actions/coursers/course/createAccessPlan";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { coursesAction } from "@/app/actions/coursers";

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({
  open,
  onOpenChange,
}) => {

  
  const { courseId } = useGetCourseId();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    isLifetime: false,
    price: 0,
    isActive: true,
  });

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const duration = formData.isLifetime ? 0 : formData.duration;

      const accessPlansData: AccessPlansData = {
        accessPlans: [
          {
            name: formData.name,
            duration: duration,
            price: formData.price,
            isActive: formData.isActive,
          },
        ],
      };

      const result = await coursesAction.courses.createAccessPlan(
        courseId,
        accessPlansData
      );

      if (result.error) {
        toast.error("Failed to create plan");
        console.error("Error creating plan:", result.error);
      } else {
        toast.success("Plan created successfully");
        setFormData({
          name: "",
          duration: 30,
          isLifetime: false,
          price: 0,
          isActive: true,
        });
        // Close dialog
        onOpenChange(false);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-primary" />
              <Label className="font-medium" htmlFor="name">
                Plan Name
              </Label>
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Basic, Premium, etc."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <Label className="font-medium" htmlFor="duration">
                  Duration
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isLifetime}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isLifetime: checked })
                  }
                  id="lifetime"
                />
                <Label htmlFor="lifetime" className="text-sm">
                  Lifetime
                </Label>
              </div>
            </div>

            <Input
              id="duration"
              type="number"
              min={1}
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: Number.parseInt(e.target.value) || 0,
                })
              }
              disabled={formData.isLifetime}
              required={!formData.isLifetime}
              className={cn(formData.isLifetime && "opacity-50")}
            />
            {!formData.isLifetime && (
              <p className="text-xs text-muted-foreground mt-1">
                Plan will be valid for {formData.duration} days after purchase
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <Label className="font-medium" htmlFor="price">
                Price (EUR)
              </Label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">€</span>
              </div>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              id="isActive"
            />
            <div>
              <Label htmlFor="isActive" className="font-medium">
                {formData.isActive ? "Active" : "Inactive"}
              </Label>
              <p className="text-xs text-gray-500">
                {formData.isActive
                  ? "Available for purchase"
                  : "Not available for purchase"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              disabled={isLoading}
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit" className="px-6">
              {isLoading ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
