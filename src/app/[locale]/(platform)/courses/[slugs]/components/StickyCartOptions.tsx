/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import type { Course } from "@/app/types/course";
import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { useCartStore } from "@/app/store/useCartStore";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface AccessPlan {
  name: string;
  duration: number;
  id: string;
  isActive: boolean;
  price: number;
}

const StickyCartOptions = ({ courseData }: { courseData: Course }) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const userId = useSession().data?.user.id;

  const {
    removeFromWishlist,
    addToWishlist,
    wishlistItems,
    addToCart,
    removeFromCart,
    cartItems,
    updateCartItem,
  } = useCartStore();
  const activeAccessPlans = courseData.accessPlans
    .filter((plan) => plan.isActive)
    .sort((a, b) => a.price - b.price);

  const getInitialSelectedPlan = useCallback(() => {
    if (cartItems.length > 0) {
      const selectedPlan = cartItems.find(
        (item) => item.courseId === courseData.courseId
      );
      const matchingPlan = activeAccessPlans.find(
        (plan) =>
          plan.price === selectedPlan?.price &&
          plan.id === selectedPlan?.accessPlanId
      );
      return matchingPlan || activeAccessPlans[0] || null;
    }
    return activeAccessPlans[0] || null;
  }, [activeAccessPlans, cartItems, courseData.courseId]);

  const [selectedPlan, setSelectedPlan] = useState<AccessPlan>(
    getInitialSelectedPlan()
  );

  useEffect(() => {
    if (isHydrated) {
      setSelectedPlan(getInitialSelectedPlan());
    }
  }, [isHydrated]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInWishlist) {
      removeFromWishlist(courseData.courseId);
    } else {
      addToWishlist(
        {
          userId: userId || "",
          courseId: courseData.courseId,
          title: courseData.title,
          slug: courseData.slug,
          language: courseData.language,
          duration: courseData.duration,
          lessonCount: courseData.lessonCount,
          price: selectedPlan?.price || 0,
          accessPlanId: selectedPlan.id,
          imageUrl: courseData.thumbnailImage || "",
          accessDuration: selectedPlan?.duration || 0,
        },
        false
      );
    }

    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) =>
        prev.filter(
          (heart) => !newHearts.some((newHeart) => newHeart.id === heart.id)
        )
      );
    }, 1000);
  };

  const handlePlanChange = (plan: AccessPlan) => {
    setSelectedPlan(plan);
    updateCartItem(
      courseData.courseId,
      {
        accessDuration: plan.duration,
        accessPlanId: plan.id,
        price: plan.price,
        isFromPrice: false,
      },
      userId || ""
    );
  };

  const handleCartClick = () => {
    if (!selectedPlan) return;

    if (isInCart) {
      removeFromCart(courseData.courseId, userId || "");
    } else {
      addToCart(
        {
          userId: userId || "",
          accessPlanId: selectedPlan.id,
          courseId: courseData.courseId,
          title: courseData.title,
          slug: courseData.slug,
          language: courseData.language,
          duration: courseData.duration,
          lessonCount: courseData.lessonCount,
          price: selectedPlan.price,
          imageUrl: courseData.thumbnailImage || "",
          accessDuration: selectedPlan.duration,
        },
        false
      );
    }
  };

  const isInWishlist = wishlistItems.some(
    (item) => item.courseId === courseData.courseId
  );

  const isInCart = cartItems.some(
    (item) => item.courseId === courseData.courseId
  );

  const formatDuration = (days: number) => {
    if (days === 0) return "Lifetime Access";
    if (days >= 365)
      return `${Math.floor(days / 365)} Year${
        Math.floor(days / 365) > 1 ? "s" : ""
      }`;
    if (days >= 30)
      return `${Math.floor(days / 30)} Month${
        Math.floor(days / 30) > 1 ? "s" : ""
      }`;
    return `${days} Days`;
  };

  const getDynamicHeight = (plansCount: number) => {
    switch (plansCount) {
      case 1:
        return 380;
      case 2:
        return 460;
      case 3:
      default:
        return 540;
    }
  };

  const handleProcceedWithPurchase = () => {
    if (!selectedPlan) return;
    addToCart(
      {
        userId: userId || "",
        accessPlanId: selectedPlan.id,
        courseId: courseData.courseId,
        title: courseData.title,
        slug: courseData.slug,
        language: courseData.language,
        duration: courseData.duration,
        lessonCount: courseData.lessonCount,
        price: selectedPlan.price,
        imageUrl: courseData.thumbnailImage || "",
        accessDuration: selectedPlan.duration,
      },
      false
    );
  };

  if (!isHydrated || !selectedPlan) {
    return (
      <div
        style={{ maxHeight: `${getDynamicHeight(activeAccessPlans.length)}px` }}
        className="w-[30%] mt-6 sticky top-[2rem] bg-white border-gray-200 border-2 rounded-lg"
      >
        <div className="p-4 h-full">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>

            <div className="space-y-2">
              {Array.from({ length: activeAccessPlans.length || 2 }).map(
                (_, i) => (
                  <div key={i} className="border border-gray-200 rounded-md">
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="text-center py-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeAccessPlans.length) {
    return (
      <div className="w-[30%] bg-white max-h-[540px] p-4 rounded-lg">
        <div className="text-gray-800 text-center">
          No access plans available
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ maxHeight: `${getDynamicHeight(activeAccessPlans.length)}px` }}
      className="w-[30%] mt-6 sticky top-[2rem] bg-white border-primary-light/60 border-2 rounded-lg"
    >
      <div className="p-4 h-full overflow-y-auto overflow-hidden">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-800">
            Choose Your Access Plan
          </h3>
          <div className="space-y-2">
            {activeAccessPlans.map((plan) => (
              <div
                key={plan.id}
                className={`cursor-pointer transition-all border shadow-md rounded-md ${
                  selectedPlan?.id === plan.id
                    ? "ring-2 ring-primary bg-primary-light/30 border-primary"
                    : "hover:bg-slate-50 border-primary-light bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedPlan(plan);
                  handlePlanChange(plan);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">
                          {plan.name}
                        </h4>
                        {plan.duration === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Best Value
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDuration(plan.duration)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        €{plan.price}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        </div>

        {selectedPlan && (
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800">
              €{selectedPlan.price}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDuration(selectedPlan.duration)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98, translateY: 2 }}
              onClick={handleCartClick}
              className="flex-1 font-medium rounded-md text-sm py-2 px-4 transition-colors bg-primary-light hover:bg-primary-light/80 text-gray-800"
            >
              {isInCart ? "Remove from cart" : "Add to cart"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleHeartClick}
              className="p-2 text-primary bg-white hover:bg-slate-50 border-primary-light border rounded-md relative"
            >
              <Heart
                className="w-5 h-5"
                fill={isInWishlist ? "#f7d09e" : "none"}
              />

              {/* Floating hearts */}
              <AnimatePresence>
                {hearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    initial={{
                      opacity: 1,
                      scale: 0.5,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 1.2,
                      x: heart.x,
                      y: heart.y - 20,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    <Heart fill="#f7d09e" className="h-4 w-4 text-primary" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.button>
          </div>
          <Link href={"/cart"} onClick={handleProcceedWithPurchase}>
            <motion.button
              whileTap={{ scale: 0.98, translateY: 2 }}
              className="w-full bg-primary hover:bg-primary/80 mt-3 text-gray-100 font-medium rounded-md text-sm py-2 px-4"
            >
              Proceed with Purchase
            </motion.button>
          </Link>

          <div className="text-center pt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log("Opening support chat")}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              Have questions? Message us
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCartOptions;
