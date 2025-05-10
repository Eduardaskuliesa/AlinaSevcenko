"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderTree, LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center  px-4 py-3 gap-3 ${
        isActive
          ? "bg-primary-light/40 text-slate-800 border-l-4 rounded-r-sm border-primary"
          : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
      }`}
    >
      <Icon
        className={isActive ? "text-slate-800" : "text-gray-600"}
        size={20}
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const isActive = (path: string) => {
    const localizedPath = `/${locale}${path}`;
    return pathname.startsWith(localizedPath);
  };

  return (
    <div className="fixed hidden lg:block w-48 h-screen bg-gray border-r-2 border-primary shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-primary/20">
          <h1 className="text-xl font-bold text-primary">Admin Portal</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          <NavItem
            href={`/${locale}/admin/courses`}
            icon={BookOpen}
            label="Courses"
            isActive={isActive("/admin/courses")}
          />

          <NavItem
            href={`/${locale}/admin/categories`}
            icon={FolderTree}
            label="Categories"
            isActive={isActive("/admin/categories")}
          />
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-primary/20">
          <p className="text-sm text-gray-500">© 2024 Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
