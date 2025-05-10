import React from "react";
import Sidebar from "./components/SideBar";
import MobileNav from "./components/MobNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 lg:p-6 md:px-10 xl:px-20 py-5 bg-gray-50 mt-16 lg:mt-0 lg:ml-48">
        {children}
      </main>
    </div>
  );
}
