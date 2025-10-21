import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CartItem } from "../types/cart";

interface CartState {
  //State
  cartItems: CartItem[];
  wishlistItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  hydrated: boolean;
  loading: boolean;

  //Actions
  syncWithBackend: (userId: string) => Promise<void>;
  setHydrated: (hydrated: boolean) => void;
  addToCart: (item: CartItem, isFromPrice?: boolean) => void;
  removeFromCart: (courseId: string, userId: string) => void;
  clearCart: (userId: string) => void;
  updateCartItem: (
    courseId: string,
    updates: Partial<CartItem>,
    userId: string
  ) => void;
  addToWishlist: (item: CartItem, isFromPrice?: boolean) => void;
  removeFromWishlist: (courseId: string, userId: string) => void;
  clearWishlist: () => void;
  clearCartOnLogout: () => void;
}

const workerUrl = process.env.WORKER_URL;
const workerKey = process.env.WORKER_API_KEY;
export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      cartItems: [],
      wishlistItems: [],
      totalPrice: 0,
      totalItems: 0,
      hydrated: false,
      loading: false,

      setHydrated: (hydrated: boolean) =>
        set(() => ({
          hydrated,
        })),

      syncWithBackend: async (userId: string) => {
        try {
          set((state) => {
            state.loading = true;
          });

          const [cartResponse, wishlistResponse] = await Promise.all([
            fetch(`${workerUrl}/cart?userId=${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": `${workerKey}` || "",
              },
            }),
            fetch(`${workerUrl}/whishlist?userId=${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": `${workerKey}` || "",
              },
            }),
          ]);

          const [cartData, wishlistData] = await Promise.all([
            cartResponse.json(),
            wishlistResponse.json(),
          ]);

          set((state) => {
            if (cartData.success) {
              state.cartItems = cartData.cart || [];
              state.totalPrice = state.cartItems.reduce(
                (sum: number, item: CartItem) => sum + item.price,
                0
              );
              state.totalItems = state.cartItems.length;
            }

            if (wishlistData.success) {
              state.wishlistItems = wishlistData.whishlist || [];
            }

            state.loading = false;
          });
        } catch (error) {
          console.error("Failed to sync with backend:", error);
          set((state) => {
            state.loading = false;
          });
        }
      },

      addToCart: async (item: CartItem, isFromPrice = false) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.courseId === item.courseId
          );

          if (existingItem) {
            return;
          }

          state.cartItems.push({
            ...item,
            isFromPrice,
          });

          state.totalPrice = state.cartItems.reduce(
            (sum, cartItem) => sum + cartItem.price,
            0
          );
          state.totalItems = state.cartItems.length;
        });

        await fetch(`${workerUrl}/cart/add?userId=${item.userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${workerKey}` || "",
          },
          body: JSON.stringify({ ...item, isFromPrice }),
        });
      },

      removeFromCart: async (courseId: string, userId: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.courseId !== courseId
          );

          state.totalPrice = state.cartItems.reduce(
            (sum, cartItem) => sum + cartItem.price,
            0
          );
          state.totalItems = state.cartItems.length;
        });

        await fetch(`${workerUrl}/cart/remove?userId=${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${workerKey}` || "",
          },
          body: JSON.stringify({ courseId }),
        });
      },

      clearCart: async (userId: string) => {
        set((state) => {
          state.cartItems = [];
          state.totalPrice = 0;
          state.totalItems = 0;
        });

        await fetch(`${workerUrl}/cart/clear?userId=${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${workerKey}` || "",
          },
        });
      },

      updateCartItem: async (
        courseId: string,
        updates: Partial<CartItem>,
        userId: string
      ) => {
        set((state) => {
          const item = state.cartItems.find(
            (cartItem) => cartItem.courseId === courseId
          );

          if (item) {
            Object.assign(item, updates);

            state.totalPrice = state.cartItems.reduce(
              (sum, cartItem) => sum + cartItem.price,
              0
            );
            state.totalItems = state.cartItems.length;
          }
        });

        await fetch(`${workerUrl}/cart/update-item?userId=${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${workerKey}` || "",
          },
          body: JSON.stringify({ courseId, updates }),
        });
      },

      addToWishlist: async (item: CartItem, isFromPrice = false) => {
        set((state) => {
          const existingItem = state.wishlistItems.find(
            (wishlistItem) => wishlistItem.courseId === item.courseId
          );

          if (!existingItem) {
            state.wishlistItems.push({
              ...item,
              isFromPrice,
            });
          }
        });

        try {
          await fetch(`${workerUrl}/whishlist/add?userId=${item.userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": `${workerKey}` || "",
            },
            body: JSON.stringify({ ...item, isFromPrice }),
          });
        } catch (error) {
          console.error("Failed to add to wishlist:", error);
        }
      },

      removeFromWishlist: async (courseId: string, userId: string) => {
        set((state) => {
          state.wishlistItems = state.wishlistItems.filter(
            (wishlistItem) => wishlistItem.courseId !== courseId
          );
        });

        try {
          await fetch(`${workerUrl}/whishlist/remove?userId=${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": `${workerKey}` || "",
            },
            body: JSON.stringify({ courseId }),
          });
        } catch (error) {
          console.error("Failed to remove from wishlist:", error);
        }
      },

      clearWishlist: async () => {
        set((state) => {
          state.wishlistItems = [];
        });
      },

      clearCartOnLogout: () => {
        set((state) => {
          state.cartItems = [];
          state.totalPrice = 0;
          state.totalItems = 0;
        });
      },
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
