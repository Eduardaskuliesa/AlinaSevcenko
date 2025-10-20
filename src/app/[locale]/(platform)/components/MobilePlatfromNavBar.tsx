"use client";
import { useState } from "react";
import { ShoppingCart, Menu } from "lucide-react";
import { useSession } from "next-auth/react";

import { useCartStore } from "@/app/store/useCartStore";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

const MobilePlatformNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  const session = useSession();

  const userInitials = session.data?.user.fullName
    ?.split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <>
      <div className="bg-gray-50 border-b border-secondary w-full h-16 flex justify-between px-4 items-center md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="font-bold text-xl xs:text-2xl sm:text-3xl font-times">Alina Savcenko</div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2 hover:bg-secondary rounded-md transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <div className="absolute top-0 -right-1 font-medium h-5 w-5 flex items-center justify-center text-xs bg-primary text-gray-100 rounded-full">
                {totalItems}
              </div>
            )}
          </Link>

          <Link
            href="/user/profile"
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium"
            aria-label="User profile"
          >
            {userInitials}
          </Link>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MobilePlatformNavBar;
