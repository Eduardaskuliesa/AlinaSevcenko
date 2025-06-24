"use client";
import { coursesAction } from "@/app/actions/coursers";
import { useCartStore } from "@/app/store/useCartStore";
import { Course } from "@/app/types/course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CartLoaderSkeleton } from "./components/CartLoderSkeleton";
import { CartSummarySkeleton } from "./components/CartSummarySkeleton";
import { CartPageItem } from "./components/CartPageItem";
import { Loader, Mail, X } from "lucide-react";
import Link from "next/link";
import CartSummary from "./components/CartSummary";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";


const CartPage = () => {
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
                `Course "${cartItem.title}" has been removed from your cart because it's no longer available.`,
                { duration: 8000 }
              );

              toast(
                (t) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span>Want this course back?</span>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          window.open(
                            `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                            "_blank"
                          );
                          toast.dismiss(t.id);
                        }}
                        className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                      >
                        <Mail className="mr-1 h-4 w-4" />
                        Email Us
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)}
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
                  `Access plan for "${cartItem.title}" was updated to the current available option.`,
                  { duration: 6000 }
                );

                toast(
                  (t) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <span>Need help with access plans?</span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            window.open(
                              `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                              "_blank"
                            );
                            toast.dismiss(t.id);
                          }}
                          className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          Email Us
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
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
                  `No access plans are currently available for "${cartItem.title}". Please contact support.`,
                  { duration: 6000 }
                );

                toast(
                  (t) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <span>Need help with access plans?</span>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            window.open(
                              `mailto:alinaanancenko@gmail.com?subject=Access Plan Issue`,
                              "_blank"
                            );
                            toast.dismiss(t.id);
                          }}
                          className="bg-primary flex items-center text-white px-2 py-1 rounded text-sm"
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          Email Us
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
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
            console.log(error);
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
        <header className="h-[5rem] bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              Shopping Cart
              <Loader className="h-8 w-8 ml-2 animate-spin"></Loader>
            </h1>
          </div>
        </header>
        <section className="flex gap-8 mx-auto max-w-7xl">
          <div className="w-[70%] h-auto px-4 py-4 mt-2 items-center justify-center">
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
        <header className="h-[5rem] bg-primary w-full flex">
          <div className="max-w-6xl w-full mx-auto">
            <h1 className="text-5xl font-times mt-4 font-semibold flex items-center text-gray-100">
              Shopping Cart
              {isLoading && (
                <Loader className="h-8 w-8 ml-2 animate-spin"></Loader>
              )}
            </h1>
          </div>
        </header>
        <section className="flex gap-8 mx-auto max-w-7xl">
          <div className="w-[70%] h-auto px-4 py-4 mt-2">
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
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            Shopping Cart
          </h1>
        </div>
      </header>
      <section className="flex gap-8 mx-auto max-w-7xl">
        <div className="w-[70%] h-auto px-4 py-4 mt-2">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <Link href={"/courses"} className=" underline">
                Browse courses
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
