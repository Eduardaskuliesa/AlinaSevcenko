"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderTree, Home, Menu, X } from "lucide-react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const isActive = (path: string) => {
    const localizedPath = `/${locale}${path}`;
    return pathname.startsWith(localizedPath);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-primary/20 flex items-center justify-between px-4 z-30">
        <button onClick={toggleMenu} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-lg font-bold text-primary">Admin Portal</h1>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleMenu} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 w-64 h-full bg-white z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <Link
            href={`/${locale}/admin/courses`}
            className={`flex items-center px-4 py-3 gap-3 ${
              isActive("/admin/courses")
                ? "bg-primary-light/40 text-slate-800 border-l-4 rounded-r-sm border-primary"
                : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
            }`}
            onClick={toggleMenu}
          >
            <BookOpen
              size={20}
              className={
                isActive("/admin/courses") ? "text-slate-800" : "text-gray-600"
              }
            />
            <span className="font-medium">Courses</span>
          </Link>

          <Link
            href={`/${locale}/admin/categories`}
            className={`flex items-center px-4 py-3 gap-3 ${
              isActive("/admin/categories")
                ? "bg-primary-light/40 text-slate-800 border-l-4 rounded-r-sm border-primary"
                : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
            }`}
            onClick={toggleMenu}
          >
            <FolderTree
              size={20}
              className={
                isActive("/admin/categories")
                  ? "text-slate-800"
                  : "text-gray-600"
              }
            />
            <span className="font-medium">Categories</span>
          </Link>

          <Link
            href={`/${locale}/courses`}
            className={`flex items-center px-4 py-3 gap-3 ${
              isActive("/courses")
                ? "bg-primary-light/40 text-slate-800 border-l-4 rounded-r-sm border-primary"
                : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
            }`}
            onClick={toggleMenu}
          >
            <Home
              size={20}
              className={
                isActive("/courses") ? "text-slate-800" : "text-gray-600"
              }
            />
            <span className="font-medium">Courses</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
