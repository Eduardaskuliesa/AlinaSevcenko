import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-blue-50 h-20 w-full border border-primary">Navigation Tabs</div>
      <div>{children}</div>
    </>
  );
}
