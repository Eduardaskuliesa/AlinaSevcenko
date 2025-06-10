import { useCartStore } from "@/app/store/useCartStore";
import { AccessPlan, Course } from "@/app/types/course";
import { convertTime } from "@/app/utils/converToMinutes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";

export function CartPageItem({
  item,
  accessPlanId,
}: {
  item: Course;
  accessPlanId: string;
}) {
  console.log("CartPageItem Props:", { item });
  console.log("CartPageItem Rendered:");
  const { updateCartItem, removeFromCart, addToWishlist } = useCartStore();
  const userId = useSession().data?.user.id;
  const [selectedPlan, setSelectedPlan] = useState<AccessPlan | undefined>();

  useEffect(() => {
    let plan = item.accessPlans.find(
      (plan) => plan.isActive && plan.id === accessPlanId
    );

    if (!plan) {
      plan = item.accessPlans.find((plan) => plan.isActive);
    }

    setSelectedPlan(plan);
  }, [item.accessPlans, accessPlanId]);

  const formatDuration = (days: number) => {
    if (days === 0) return "Lifetime";
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  const activeAccessPlans = item.accessPlans
    .filter((plan) => plan.isActive)
    .sort((a, b) => a.price - b.price);

  const handlePlanChange = (plan: AccessPlan) => {
    setSelectedPlan(plan);
    updateCartItem(
      item.courseId,
      {
        accessDuration: plan.duration,
        accessPlanId: plan.id,
        price: plan.price,
        isFromPrice: false,
      },
      userId || ""
    );
  };

  const handleRemove = () => {
    removeFromCart(item.courseId, userId || "");
  };

  const handleMoveToWishlist = () => {
    addToWishlist(
      {
        userId: userId || "",
        courseId: item.courseId,
        accessPlanId: selectedPlan?.id || "",
        title: item.title,
        lessonCount: item.lessonCount,
        duration: item.duration,
        slug: item.slug,
        language: item.language,
        price: selectedPlan?.price || 0,
        imageUrl: item.thumbnailImage || "",
        accessDuration: selectedPlan?.duration || 0,
      },
      false
    );

    removeFromCart(item.courseId, userId || "");
  };

  return (
    <div className="mb-4 shadow-md border rounded-lg bg-white border-gray-200 relative">
      {selectedPlan?.duration === 0 && (
        <div className="absolute -top-2 -right-2 bg-secondary text-gray-800 font-medium rotate-12 text-xs px-2 py-1 rounded-full">
          Lifetime
        </div>
      )}

      {/* Main cart item */}
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-4 flex-1">
          <Image
            width={200}
            height={150}
            src={item.thumbnailImage}
            alt={item.title}
            className="w-24 h-16 rounded-md object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="text-lg font-semibold">{item.title}</h4>
            <div className="flex items-center">
              <p className="text-gray-600 text-sm">
                Total lessons:{item.lessonCount}
              </p>
              <div className="h-1 w-1 rounded-full mx-1 mb-0.5 bg-gray-700"></div>
              <p className="text-gray-600 text-sm">
                Duration: {convertTime(item.duration)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-xs items-center">
          <h4 className="text-lg font-semibold">AccessPlan</h4>
          <div className="flex items-center">
            <div className="h-1 w-1 rounded-full mx-1 mb-0.5 bg-gray-700"></div>
            <p className="text-gray-600 text-sm">{selectedPlan?.name}</p>
            <div className="h-1 w-1 rounded-full mx-1 mb-0.5 bg-gray-700"></div>
            <p className="text-gray-600 text-sm">
              Plan duration: {formatDuration(selectedPlan?.duration || 0)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-gray-800 text-lg px-2 font-bold">
            €{selectedPlan?.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Access plans selector */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h5 className="font-medium text-gray-800 mb-2">Select Access Plan:</h5>
        <div className="flex gap-2 flex-wrap">
          {activeAccessPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handlePlanChange(plan)}
              className={`px-3 py-2 rounded-md border transition-colors ${
                selectedPlan?.id === plan.id
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="font-medium text-sm">{plan.name}</div>
              <div className="text-sm">
                {formatDuration(plan.duration)} - €{plan.price.toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-3">
        <motion.button
          whileTap={{ scale: 0.9, translateY: 2 }}
          onClick={handleRemove}
          className="text-sm text-pink-900 hover:text-pink-950 transition-colors"
        >
          Remove
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9, translateY: 2 }}
          onClick={handleMoveToWishlist}
          className="text-sm text-pink-900 hover:text-pink-950 transition-colors"
        >
          Move to Wishlist
        </motion.button>
      </div>
    </div>
  );
}
