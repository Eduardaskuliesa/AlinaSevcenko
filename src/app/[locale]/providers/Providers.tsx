"use client";
import { SessionProvider } from "next-auth/react";
import { ToasterWithMax } from "./useToast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
