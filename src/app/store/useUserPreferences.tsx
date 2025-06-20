import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { UserPreferences } from "../types/user";
import { userActions } from "../actions/user";

interface UserPreferencesState {
  //State
  preferences: UserPreferences | null;
  hydrated: boolean;
  loading: boolean;

  //Actions
  setHydrated: (hydrated: boolean) => void;
  setPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    immer((set) => ({
      preferences: null,
      hydrated: false,
      loading: false,

      setHydrated: (hydrated: boolean) =>
        set(() => ({
          hydrated,
        })),

      setPreferences: async () => {
        set(() => ({ loading: true }));

        const preferencesResponse =
          await userActions.preferences.getPreferences();

        set(() => ({
          preferences: preferencesResponse?.preferences,
          hydrated: true,
          loading: false,
        }));
      },

      updatePreferences(updates) {
        set((state) => {
          if (state.preferences) {
            state.preferences = {
              ...state.preferences,
              ...updates,
            };
          }
        });
      },
    })),
    {
      name: "user-preferences-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
