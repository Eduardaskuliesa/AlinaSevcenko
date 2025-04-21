
import React from "react";
import Sidebar from "./components/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:px-10 xl:px-20 py-20 bg-gray-50 ml-48">{children}</main>
    </div>
  );
}
