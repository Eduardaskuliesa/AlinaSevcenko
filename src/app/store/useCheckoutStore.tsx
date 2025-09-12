import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/app/types/cart';

interface CheckoutStore {
  checkoutItems: CartItem[];
  clientSecret: string;
  userId: string;
  setCheckoutData: (data: { items: CartItem[], clientSecret: string, userId: string }) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    immer((set) => ({
      checkoutItems: [],
      clientSecret: '',
      userId: '',
      setCheckoutData: ({ items, clientSecret, userId }) => 
        set((state) => {
          state.checkoutItems = items;
          state.clientSecret = clientSecret;
          state.userId = userId;
        }),
      clearCheckoutData: () => 
        set((state) => {
          state.checkoutItems = [];
          state.clientSecret = '';
          state.userId = '';
        }),
    })),
    {
      name: 'checkout-storage',
    }
  )
);