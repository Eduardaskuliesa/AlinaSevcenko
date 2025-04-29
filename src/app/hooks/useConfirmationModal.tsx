"use client";

import { useState } from "react";

export function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    loading,
    setLoading,
    close,
    open,
  };
}
