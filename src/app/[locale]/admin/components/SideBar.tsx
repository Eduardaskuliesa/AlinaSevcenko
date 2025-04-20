"use client";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    if (expandedMenu === menu) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menu);
    }
  };

  return (
    <div
      className={`fixed w-48 shadow-lg border-r-2 h-screen border-primary top-0 left-0 bg-gray-50 p-4 transition-all duration-300`}
    >
      <div className="flex flex-col space-y-6">
        <div className="text-xl font-bold text-primary mb-6">Admin Portal</div>

        {/* Courses Menu */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleMenu("courses")}
            className="flex items-center justify-between text-gray-700 hover:text-primary font-medium"
          >
            <span>Courses</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                expandedMenu === "courses" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expandedMenu === "courses" && (
            <div className="ml-4 mt-2 flex flex-col space-y-2">
              <Link
                href="/admin/courses"
                className="text-gray-600 hover:text-primary"
              >
                Course Listing
              </Link>
              <Link
                href="/admin/courses/create"
                className="text-gray-600 hover:text-primary"
              >
                Create Course
              </Link>
            </div>
          )}
        </div>

        {/* Categories Menu */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleMenu("categories")}
            className="flex items-center justify-between text-gray-700 hover:text-primary font-medium"
          >
            <span>Categories</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                expandedMenu === "categories" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expandedMenu === "categories" && (
            <div className="ml-4 mt-2 flex flex-col space-y-2">
              <Link
                href="/admin/categories"
                className="text-gray-600 hover:text-primary"
              >
                Category Listing
              </Link>
              <Link
                href="/admin/categories/create"
                className="text-gray-600 hover:text-primary"
              >
                Create Category
              </Link>
              <Link
                href="/admin/categories/assign"
                className="text-gray-600 hover:text-primary"
              >
                Assign Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
