/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import type { Course } from "@/app/types/course";
import { useCallback, useEffect, useState, useRef } from "react";
import { Heart, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { useCartStore } from "@/app/store/useCartStore";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AccessPlan {
  name: string;
  duration: number;
  id: string;
  isActive: boolean;
  price: number;
}

interface MobileCartDrawerProps {
  courseData: Course;
}

const MobileCartDrawer = ({ courseData }: MobileCartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [dragY, setDragY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

    if (isInWishlist) {
      removeFromWishlist(courseData.courseId, userId || "");
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

  const handleProceedWithPurchase = () => {
    if (!selectedPlan) return;
    if (!isInCart) {
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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldClose = info.offset.y > 100 || info.velocity.y > 500;
    if (shouldClose) {
      setIsOpen(false);
    }
    setDragY(0);
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

  if (!isHydrated || !selectedPlan || !activeAccessPlans.length) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-50 border-t-2 border-primary-light shadow-lg z-40 lg:hidden">
        <div className="px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 truncate">
                {formatDuration(selectedPlan.duration)}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                €{selectedPlan.price}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleHeartClick}
                className="p-2.5 text-primary text-base bg-white hover:bg-slate-50 border-primary-light border rounded-md relative flex-shrink-0"
              >
                <Heart className="" fill={isInWishlist ? "#f7d09e" : "none"} />
                <AnimatePresence>
                  {hearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
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

              <motion.button
                whileTap={{ scale: 0.98, translateY: 2 }}
                onClick={handleCartClick}
                className="font-medium rounded-md text-base px-3 py-2.5 transition-colors bg-primary-light hover:bg-primary-light/80 text-gray-800 flex-shrink-0"
              >
                {isInCart ? "Remove" : "Add to cart"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="p-2.5 hover:bg-gray-300 bg-gray-200 rounded-md transition-colors flex-shrink-0"
              >
                <ChevronUp className="" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] sm:h-[80vh] lg:hidden p-0 bg-white overflow-hidden"
        >
          {/* Drag Handle */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDrag={(_, info) => {
              if (info.offset.y > 0) {
                setDragY(info.offset.y);
              }
            }}
            onDragEnd={handleDragEnd}
            style={{ y: dragY }}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="flex flex-col items-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
            </div>
          </motion.div>

          <div ref={contentRef} className="overflow-hidden h-[calc(100%-40px)]">
            <SheetHeader className="px-4 sm:px-6 pt-2 pb-3 sm:pb-4">
              <SheetTitle className="text-xl font-semibold text-gray-800">
                Choose Your Access Plan
              </SheetTitle>
            </SheetHeader>

            <div className="px-4 sm:px-6 pb-6 overflow-y-auto h-[calc(100%-60px)]">
              <div className="space-y-3 mb-6 mt-2">
                {activeAccessPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`cursor-pointer transition-all border-2 rounded-xl ${
                      selectedPlan?.id === plan.id
                        ? "ring-2 ring-primary bg-primary-light/30 border-primary"
                        : "hover:bg-slate-50 border-gray-200 bg-white"
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan);
                      handlePlanChange(plan);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">
                              {plan.name}
                            </h4>
                            {plan.duration === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Best Value
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDuration(plan.duration)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-800">
                            €{plan.price}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary-light/50 to-primary-light/30 rounded-xl p-4 mb-4 border border-primary-light">
                <p className="text-sm text-gray-600 text-center mb-1">
                  Selected Plan
                </p>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">
                    €{selectedPlan.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDuration(selectedPlan.duration)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCartClick}
                    className="flex-1 font-semibold rounded-lg py-3 px-4 bg-primary-light hover:bg-primary-light/80 text-gray-800 border border-primary-light"
                  >
                    {isInCart ? "Remove from cart" : "Add to cart"}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHeartClick}
                    className="p-3 bg-white hover:bg-slate-50 border-2 border-primary-light rounded-lg relative"
                  >
                    <Heart
                      className="w-6 h-6 text-primary"
                      fill={isInWishlist ? "#f7d09e" : "none"}
                    />
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
                          <Heart
                            fill="#f7d09e"
                            className="h-4 w-4 text-primary"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <Link href="/cart" onClick={handleProceedWithPurchase}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary mt-4 hover:bg-primary/90 text-white font-semibold rounded-lg py-3 px-4 text-base"
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileCartDrawer;