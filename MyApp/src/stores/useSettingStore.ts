import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

export type ScanSensitivity =
  | "Low"
  | "Balanced"
  | "High";

type SettingStore = {
  pushNotifications: boolean;
  scanSensitivity: ScanSensitivity;
  hasHydrated: boolean;

  setPushNotifications: (value: boolean) => void;

  setScanSensitivity: (
    sensitivity: ScanSensitivity
  ) => void;

  cycleScanSensitivity: () => void;

  setHasHydrated: (value: boolean) => void;
};

const SENSITIVITY_LEVELS: ScanSensitivity[] = [
  "Low",
  "Balanced",
  "High",
];

export const useUserSettingsStore =
  create<SettingStore>()(
    persist(
      (set, get) => ({
        pushNotifications: true,
        scanSensitivity: "Balanced",
        hasHydrated: false,

        setPushNotifications: (value) =>
          set({
            pushNotifications: value,
          }),

        setScanSensitivity: (sensitivity) =>
          set({
            scanSensitivity: sensitivity,
          }),

        cycleScanSensitivity: () => {
          const current =
            get().scanSensitivity;

          const currentIndex =
            SENSITIVITY_LEVELS.indexOf(current);

          const nextIndex =
            (currentIndex + 1) %
            SENSITIVITY_LEVELS.length;

          set({
            scanSensitivity:
              SENSITIVITY_LEVELS[nextIndex],
          });
        },

        setHasHydrated: (value) =>
          set({
            hasHydrated: value,
          }),
      }),
      {
        name: "@suraksha_sms_settings",

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        partialize: (state) => ({
          pushNotifications:
            state.pushNotifications,

          scanSensitivity:
            state.scanSensitivity,
        }),

        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error(
                "Failed to load settings:",
                error
              );
            }

            state?.setHasHydrated(true);
          };
        },
      }
    )
  );