"use client";
import { coursesAction } from "@/app/actions/coursers";
import { useCartStore } from "@/app/store/useCartStore";
import { Course } from "@/app/types/course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CartLoaderSkeleton } from "./components/skeletons/CartLoderSkeleton";
import { CartSummarySkeleton } from "./components/skeletons/CartSummarySkeleton";
import { CartPageItem } from "./components/CartPageItem";
import { Loader, Mail, X } from "lucide-react";
import Link from "next/link";
import CartSummary from "./components/CartSummary";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const CartPage = () => {
  const t = useTranslations("CartPage");
  const { cartItems, hydrated, removeFromCart, updateCartItem } =
    useCartStore();

  const userId = useSession().data?.user.id;

  const { data: freshCartItems, isLoading } = useQuery({
    queryKey: ["cartItems", cartItems.map((item) => item.courseId)],
    queryFn: async () => {
      const results = await Promise.all(
        cartItems.map(async (cartItem) => {
          try {
            const result = await coursesAction.courses.getCourseClient(
              cartItem.courseId
            );
            const course = result.course as Course;
            if (!course || !course.isPublished) {
              toast.error(
                t("courseRemovedUnavailable", { title: cartItem.title }),
                { duration: 8000 }
              );

              toast(
                (toastInstance) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span>{t("wantThisCourseBack")}</span>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          window.open(
                            `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                            "_blank"
                          );
                          toast.dismiss(toastInstance.id);
                        }}
                        className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                      >
                        <Mail className="mr-1 h-4 w-4" />
                        {t("emailUs")}
                      </button>
                      <button
                        onClick={() => toast.dismiss(toastInstance.id)}
                        className="bg-gray-500 flex items-center text-white px-2 py-1 rounded text-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ),
                { duration: Infinity, position: "bottom-right" }
              );

              removeFromCart(cartItem.courseId, userId || "");
              return null;
            }

            const selectedPlan = course.accessPlans.find(
              (plan) => plan.id === cartItem.accessPlanId && plan.isActive
            );

            if (!selectedPlan) {
              const firstActivePlan = course.accessPlans
                .filter((plan) => plan.isActive)
                .sort((a, b) => a.price - b.price)[0];

              if (firstActivePlan) {
                toast.success(
                  t("accessPlanUpdated", { title: cartItem.title }),
                  { duration: 6000 }
                );

                toast(
                  (toastInstance) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <span>{t("needHelpWithAccessPlans")}</span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            window.open(
                              `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                              "_blank"
                            );
                            toast.dismiss(toastInstance.id);
                          }}
                          className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          {t("emailUs")}
                        </button>
                        <button
                          onClick={() => toast.dismiss(toastInstance.id)}
                          className="bg-gray-500 flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ),
                  { duration: Infinity, position: "bottom-right" }
                );

                updateCartItem(
                  cartItem.courseId,
                  {
                    accessPlanId: firstActivePlan.id,
                    accessDuration: firstActivePlan.duration,
                    price: firstActivePlan.price,
                  },
                  userId || ""
                );
              } else {
                toast.error(
                  t("noAccessPlansAvailable", { title: cartItem.title }),
                  { duration: 6000 }
                );

                toast(
                  (toastInstance) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <span>{t("needHelpWithAccessPlans")}</span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            window.open(
                              `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                              "_blank"
                            );
                            toast.dismiss(toastInstance.id);
                          }}
                          className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          {t("emailUs")}
                        </button>
                        <button
                          onClick={() => toast.dismiss(toastInstance.id)}
                          className="bg-gray-500 flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ),
                  { duration: Infinity, position: "bottom-right" }
                );
              }
            }

            return result;
          } catch (error) {
            console.error("Error fetching course data:", error);
            removeFromCart(cartItem.courseId, userId || "");
            return null;
          }
        })
      );
      return results.filter(Boolean);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10,
    enabled: cartItems.length > 0 && hydrated,
  });

  if (!hydrated) {
    return (
      <>
        <header className="h-auto pb-4 bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              {t("shoppingCart")}
            </h1>
          </div>
        </header>
        <section className="flex flex-col lg:flex-row gap-8 mx-auto max-w-7xl">
          <div className="lg:w-[70%] h-auto px-4 py-4 mt-2 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin mx-auto" />
          </div>
          <CartSummarySkeleton />
        </section>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <header className="h-auto pb-4 bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              {t("shoppingCart")}
            </h1>
          </div>
        </header>
        <section className="flex flex-col lg:flex-row lg:gap-8 mx-auto max-w-7xl pb-4">
          <div className="lg:w-[70%] h-auto px-4 py-4 mt-2">
            {Array.from({ length: cartItems.length }).map((_, index) => (
              <CartLoaderSkeleton key={index} />
            ))}
          </div>
          <CartSummarySkeleton />
        </section>
      </>
    );
  }

  return (
    <>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold text-gray-100">
            {t("shoppingCart")}
          </h1>
        </div>
      </header>
      <section className="flex flex-col lg:flex-row gap-2 lg:gap-8 mx-auto max-w-7xl px-4 lg:px-0">
        <div className="w-full lg:w-[70%] py-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <h2 className="text-2xl font-semibold">{t("yourCartIsEmpty")}</h2>
              <Link href={"/courses"} className="underline">
                {t("browseCourses")}
              </Link>
            </div>
          ) : (
            freshCartItems?.map((item, index) => (
              <CartPageItem
                key={item?.course?.courseId}
                accessPlanId={cartItems[index].accessPlanId}
                item={item?.course as Course}
              />
            ))
          )}
        </div>
        <CartSummary />
      </section>
    </>
  );
};

export default CartPage;
