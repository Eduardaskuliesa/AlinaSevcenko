"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  BookOpen,
  User,
  Globe,
  LogOut,
  LibraryBig,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import WhisList from "./WhisList";
import CartList from "./CartList";
import { useCartStore } from "@/app/store/useCartStore";

const PlatformNavBar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems, clearCartOnLogout, clearWishlist } = useCartStore();

  const session = useSession();

  const userInitials = session.data?.user.fullName
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleLogout = async () => {
    try {
      window.location.replace("/login");
      toast.success("Successfully logged out");
      await signOut({
        redirect: false,
      });
      clearCartOnLogout();
      clearWishlist();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an error logging out. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 border-secondary w-full h-16 flex justify-between md:px-4 lg:px-14 2xl:px-24 items-center">
      <div className="font-bold text-xl">Logo</div>

      <div className="flex items-center gap-2">
        {/* Regular Nav Items */}

        <Link href="/courses">
          <div className="flex items-center  gap-1.5 p-2  hover:bg-secondary hover:text-orange-900 cursor-pointer rounded-md transition-colors duration-200">
            <BookOpen className="w-5 h-5" />
            <span>Courses</span>
          </div>
        </Link>
        <Link href="/my-courses/courses">
          <div className="flex items-center  gap-1.5 p-2  hover:bg-secondary hover:text-orange-900 cursor-pointer rounded-md transition-colors duration-200">
            <LibraryBig className="w-5 h-5" />
            <span>My learning</span>
          </div>
        </Link>

        <Link href="/user/profile">
          <div className="flex items-center gap-1.5 p-2 hover:bg-secondary hover:text-orange-900  cursor-pointer rounded-md transition-colors duration-200">
            <User className="w-5 h-5" />
            <span>My profile</span>
          </div>
        </Link>

        {/* Wishlist Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter("wishlist")}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200",
              openDropdown === "wishlist"
                ? "bg-secondary text-orange-900"
                : "hover:bg-secondary hover:text-orange-900"
            )}
          >
            <Heart className="w-5 h-5" />
          </div>
          <WhisList
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          ></WhisList>
        </div>

        {/* Cart Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter("cart")}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "flex items-center p-2 rounded-md relative  cursor-pointer transition-colors duration-200",
              openDropdown === "cart"
                ? "bg-secondary text-orange-900"
                : "hover:bg-secondary hover:text-orange-900"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <div className="absolute top-0 -right-1 font-medium h-5 w-5 flex items-center justify-center text-sm bg-primary text-gray-100 rounded-full">
                {totalItems}
              </div>
            )}
          </div>

          <CartList
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          ></CartList>
        </div>

        {/* Avatar Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter("profile")}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "w-9 h-9 ml-2 rounded-full bg-primary flex items-center justify-center text-white font-medium cursor-pointer",
              "transition-opacity duration-200",
              openDropdown === "profile" ? "" : "hover:opacity-90"
            )}
          >
            {userInitials}
          </div>

          <div
            className={cn(
              "absolute right-0 mt-2 rounded-md shadow-lg bg-white z-10 border border-primary-light w-64",
              "transition-all duration-200",
              openDropdown === "profile"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1 pointer-events-none invisible"
            )}
          >
            <div className="py-2">
              <ProfileMenuItem
                href="/my-courses/courses"
                icon={<BookOpen className="w-4 h-4" />}
                title="My courses"
              />
              <ProfileMenuItem
                href="/my-courses/wishlist"
                icon={<Heart className="w-4 h-4" />}
                title="My wishlist"
              />
              <ProfileMenuItem
                href="/cart"
                icon={<ShoppingCart className="w-4 h-4" />}
                title="My cart"
              />

              <div className="h-px bg-gray-200 my-2 mx-3"></div>

              <ProfileMenuItem
                href="#"
                icon={<Globe className="w-4 h-4" />}
                title="Language"
              />

              <div className="h-px bg-gray-200 my-2 mx-3"></div>

              <ProfileMenuItem
                href="/user/profile"
                icon={<User className="w-4 h-4" />}
                title="My account"
              />

              <div className="h-px bg-gray-200 my-2 mx-3"></div>

              <LogoutMenuItem
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
                title="Logout"
                className="text-red-500 hover:text-red-700 hover:bg-red-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileMenuItem = ({
  href,
  icon,
  title,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 hover:bg-secondary hover:text-orange-900 mx-2 rounded-md  cursor-pointer transition-colors duration-150",
        "text-gray-700 font-medium text-sm",
        className
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const LogoutMenuItem = ({
  onClick,
  icon,
  title,
  className,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2 hover:bg-secondary hover:text-orange-900 mx-2 rounded-md cursor-pointer transition-colors duration-150",
        "text-gray-700 font-medium text-sm",
        className
      )}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
};

export default PlatformNavBar;
