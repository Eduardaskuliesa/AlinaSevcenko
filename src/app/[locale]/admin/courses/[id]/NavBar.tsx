"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Info, BookOpen, Settings, Home, ChevronRight } from "lucide-react";

const NavBar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const locale = pathSegments[1];
  const courseId = pathSegments[4];

  const getActiveTab = () => {
    if (pathname.includes("/lessons")) return "lessons";
    if (pathname.includes("/settings")) return "settings";
    return "info";
  };

  const activeTab = getActiveTab();

  const baseUrl = `/${locale}/admin/courses/${courseId}`;

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

  const currentTabName =
    tabs.find((tab) => tab.id === activeTab)?.name || "Info";

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-2 px-2">
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
      <div className="flex flex-col lg:flex-row  lg:items-center justify-between border-b px-2">
        <h1 className="text-3xl font-bold tracking-tight">{currentTabName}</h1>
        <div className="flex items-center gap-4 lg:gap-4">
          {tabs.map((tab) => (
            <Link key={tab.id} href={tab.href}>
              <div
                className={`
                  flex items-center py-1 lg:px-4 lg:py-2 font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 lg:border-b-4 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }
                `}
              >
                <tab.icon className="mr-1 lg:mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                {tab.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
