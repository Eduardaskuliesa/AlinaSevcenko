import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CartItem } from "../types/cart";

interface CartState {
  //State
  cartItems: CartItem[];
  wishlistItems: CartItem[];
  totalPrice: number;
  hydrated: boolean;
  loading: boolean;

  //Actions
  setHydrated: (hydrated: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  updateCartItem: (courseId: string, updates: Partial<CartItem>) => void;
  addToWishlist: (item: CartItem) => void;
  removeFromWishlist: (courseId: string) => void;
  clearWishlist: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      cartItems: [],
      wishlistItems: [],
      totalPrice: 0,
      hydrated: false,
      loading: false,

      setHydrated: (hydrated: boolean) =>
        set(() => ({
          hydrated,
        })),

      addToCart: (item: CartItem) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.courseId === item.courseId
          );

          if (existingItem) {
            return;
          } else {
            state.cartItems.push({
              ...item,
            });
          }

          state.totalPrice = state.cartItems.reduce(
            (sum, cartItem) => sum + cartItem.price,
            0
          );
        });
      },

      removeFromCart: (courseId: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.courseId !== courseId
          );

          state.totalPrice = state.cartItems.reduce(
            (sum, cartItem) => sum + cartItem.price,
            0
          );
        });
      },

      clearCart: () => {
        set((state) => {
          state.cartItems = [];
          state.totalPrice = 0;
        });
      },

      updateCartItem: (courseId: string, updates: Partial<CartItem>) => {
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
          }
        });
      },

      addToWishlist: (item: CartItem) => {
        set((state) => {
          const existingItem = state.wishlistItems.find(
            (wishlistItem) => wishlistItem.courseId === item.courseId
          );

          if (!existingItem) {
            state.wishlistItems.push({
              ...item,
            });
          }
        });
      },

      removeFromWishlist: (courseId: string) => {
        set((state) => {
          state.wishlistItems = state.wishlistItems.filter(
            (wishlistItem) => wishlistItem.courseId !== courseId
          );
        });
      },

      clearWishlist: () => {
        set((state) => {
          state.wishlistItems = [];
        });
      },
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
