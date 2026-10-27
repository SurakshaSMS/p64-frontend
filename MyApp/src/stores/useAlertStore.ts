// src/stores/useAlertStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertItem } from "@/types/alert.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AlertStore = {
  alertItems: AlertItem[];

  setAlertItems: (items: AlertItem[]) => void;
  appendAlertItems: (items: AlertItem[]) => void;

  markAlertAsRead: (id: string) => void;
  dismissAlert: (id: string) => void;

  clearAlertItems: () => void;
};

function mergeAlertsById(
  existingAlerts: AlertItem[],
  newAlerts: AlertItem[]
): AlertItem[] {
  const alertMap = new Map<string, AlertItem>();

  for (const alert of existingAlerts) {
    alertMap.set(alert.id, alert);
  }

  for (const alert of newAlerts) {
    alertMap.set(alert.id, alert);
  }

  return Array.from(alertMap.values()).sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set) => ({
      alertItems: [],

      setAlertItems: (items) => {
        set({
          alertItems: [...items].sort((a, b) => b.timestamp - a.timestamp),
        });
      },

      appendAlertItems: (items) => {
        set((state) => ({
          alertItems: mergeAlertsById(state.alertItems, items),
        }));
      },

      markAlertAsRead: (id) => {
        set((state) => ({
          alertItems: state.alertItems.map((alert) =>
            alert.id === id
              ? {
                  ...alert,
                  unread: false,
                }
              : alert
          ),
        }));
      },

      dismissAlert: (id) => {
        set((state) => ({
          alertItems: state.alertItems.map((alert) =>
            alert.id === id
              ? {
                  ...alert,
                  dismissed: true,
                }
              : alert
          ),
        }));
      },

      clearAlertItems: () => {
        set({
          alertItems: [],
        });
      },
    }),
    {
      name: "alert-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);