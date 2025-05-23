"use client";
import React, { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

function useMaxToasts(max: number) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= max)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts, max]);
}

export function ToasterWithMax({
  limit = 10,
  ...props
}: React.ComponentProps<typeof Toaster> & {
  limit?: number;
}) {
  useMaxToasts(limit);

  return <Toaster {...props} />;
}
