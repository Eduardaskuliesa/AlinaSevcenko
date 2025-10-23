"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  LibraryBig,
  User,
  Heart,
  ShoppingCart,
  Globe,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCartStore } from "@/app/store/useCartStore";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const session = useSession();
  const t = useTranslations("PlatformNav")
  const { clearCartOnLogout, clearWishlist } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      clearCartOnLogout();
      clearWishlist();
      toast.success(t("successfullyLoggedOut"));
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an error logging out. Please try again.");
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                {session.data?.user.fullName
                  ?.split(" ")
                  .map((name) => name.charAt(0).toUpperCase())
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {session.data?.user.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  {session.data?.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <MobileMenuItem
              href="/courses"
              icon={<BookOpen className="w-5 h-5" />}
              title="Courses"
              onClick={onClose}
            />
            <MobileMenuItem
              href="/my-courses/courses"
              icon={<LibraryBig className="w-5 h-5" />}
              title="My learning"
              onClick={onClose}
            />
            <MobileMenuItem
              href="/user/profile"
              icon={<User className="w-5 h-5" />}
              title="My profile"
              onClick={onClose}
            />

            <div className="h-px bg-gray-200 my-4 mx-4" />

            <MobileMenuItem
              href="/my-courses/wishlist"
              icon={<Heart className="w-5 h-5" />}
              title="My wishlist"
              onClick={onClose}
            />
            <MobileMenuItem
              href="/cart"
              icon={<ShoppingCart className="w-5 h-5" />}
              title="My cart"
              onClick={onClose}
            />

            <div className="h-px bg-gray-200 my-4 mx-4" />

            <MobileMenuItem
              href="/user/profile"
              icon={<Globe className="w-5 h-5" />}
              title="Language"
              onClick={onClose}
            />
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface MobileMenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const MobileMenuItem = ({
  href,
  icon,
  title,
  onClick,
}: MobileMenuItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 mx-4 hover:bg-secondary hover:text-orange-900 rounded-md transition-colors text-gray-700 font-medium"
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export default MobileMenu;
