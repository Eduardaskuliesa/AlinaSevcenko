"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster position="top-center" />
      {children}
    </SessionProvider>
  );
}
