"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { AccessPlan } from "@/app/types/course";

export interface CoursePlanCardProps {
  plan: AccessPlan;
  isToggleLoading?: boolean;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const CoursePlanCard: React.FC<CoursePlanCardProps> = ({
  plan,
  isToggleLoading,
  onToggle,
  onEdit,
  onDelete,
  className = "",
}) => {
  const isLiveTime = plan.duration === 0;
  return (
    <Card
      className={`border-2 ${
        plan.isActive ? "border-primary-light/60 bg-white" : "border-gray-200"
      } shadow-sm transition-all duration-200 ${className}`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={plan.isActive}
            onCheckedChange={(checked) => onToggle(plan.id, checked)}
            aria-label={`Toggle ${plan.name} plan`}
          />

          <span className="text-sm text-muted-foreground">
            {plan.isActive ? "Enabled" : "Disabled"}
          </span>
          {isToggleLoading && (
            <Loader className="animate-spin h-5 w-5"></Loader>
          )}
        </div>
        <Badge
          variant={plan.isActive ? "secondary" : "outline"}
          className="ml-auto"
        >
          {plan.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent>
        <h3 className="text-2xl font-medium text-gray-800 mb-4">{plan.name}</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">
              {isLiveTime
                ? "Live time"
                : `${plan.duration} ${plan.duration === 1 ? "day" : "days"}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-xl font-semibold">€{plan.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onEdit(plan.id)}
            >
              <Pencil size={14} />
              <span>Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-red-500 hover:bg-red-50 flex items-center gap-1"
              onClick={() => onDelete(plan.id)}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
