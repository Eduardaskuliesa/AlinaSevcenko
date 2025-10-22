"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type NavItem = {
  label: string;
  href: string;
};

const Navigation = () => {
  const pathname = usePathname();
  const t = useTranslations("UserNavigation");

  const navItems: NavItem[] = [
    { label: t("courses"), href: "/my-courses/courses" },
    { label: t("profile"), href: "/user/profile" },
    { label: t("wishlist"), href: "/my-courses/wishlist" },
  ];

  return (
    <nav className="flex gap-5 text-xl font-medium text-gray-200">
      {navItems.map((item) => {
        const pathParts = pathname.split("/");
        const isLanguagePrefix =
          pathParts.length > 1 && pathParts[1].length === 2;

        const normalizedPath = isLanguagePrefix
          ? `/${pathParts.slice(2).join("/")}`
          : pathname;

        const isActive =
          normalizedPath === item.href ||
          normalizedPath.startsWith(`${item.href}/`);

        const fullHref = isLanguagePrefix
          ? `/${pathParts[1]}${item.href}`
          : item.href;

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={` hover:text-white px-1 transition-colors ${
              isActive ? "border-b-[5px] border-secondary text-white" : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
