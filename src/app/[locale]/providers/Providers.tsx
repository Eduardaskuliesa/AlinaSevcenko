"use client";
import { ToasterWithMax } from "@/app/hooks/useToastMax";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/app/lib/getQueryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToasterWithMax
          limit={3}
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
          containerStyle={{}}
          gutter={8}
          containerClassName=""
          reverseOrder={false}
        />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
