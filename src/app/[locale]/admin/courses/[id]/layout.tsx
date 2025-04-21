"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Info, Settings, ChevronRight, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const courseId = pathname.split("/")[4];

  // Get the current active tab based on the URL pathname
  const getActiveTab = () => {
    if (pathname.includes("/lessons")) return "lessons";
    if (pathname.includes("/settings")) return "settings";
    return "info"; // Default tab
  };

  const activeTab = getActiveTab();

  // Base URL for the course
  const baseUrl = `/${locale}/admin/courses/${courseId}`;

  // Tab configuration
  const tabs = [
    {
      name: "Info",
      href: `${baseUrl}/info`,
      icon: Info,
      id: "info",
    },
    {
      name: "Lessons",
      href: `${baseUrl}/lessons`,
      icon: BookOpen,
      id: "lessons",
    },
    {
      name: "Settings",
      href: `${baseUrl}/settings`,
      icon: Settings,
      id: "settings",
    },
  ];

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);

    const breadcrumbs = [
      { name: "Home", href: `/${locale}`, icon: Home },
      { name: "Courses", href: `/${locale}/admin/courses` },
      {
        name: `Course ${currentTab?.name || "Info"}`,
        href: currentTab?.href || `${baseUrl}/info`,
      },
    ];

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Get the current tab name for the heading
  const currentTabName =
    tabs.find((tab) => tab.id === activeTab)?.name || "Info";

  return (
    <div className="max-w-7xl p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-gray-400" />
            )}
            <Link
              href={crumb.href}
              className="hover:text-primary flex items-center"
            >
              {crumb.icon && <crumb.icon className="mr-1 h-3.5 w-3.5" />}
              {crumb.name}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Heading and Navigation */}
      <div className="flex items-center justify-between border-b">
        <h1 className="text-3xl font-bold tracking-tight">{currentTabName}</h1>

        <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.href}>
              <div
                className={`
                  flex items-center px-4 py-2 font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "text-primary border-b-4 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }
                `}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-6">{children}</div>
    </div>
  );
}
