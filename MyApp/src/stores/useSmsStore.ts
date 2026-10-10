import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  FlaggedSmsMessage,
  SmsMessage,
} from "@/types/message.type";

type SmsStore = {
  rawMessages: SmsMessage[];
  flaggedMessages: FlaggedSmsMessage[];

  setRawMessages: (messages: SmsMessage[]) => void;
  setFlaggedMessages: (messages: FlaggedSmsMessage[]) => void;

  appendRawMessages: (messages: SmsMessage[]) => void;
  appendFlaggedMessages: (messages: FlaggedSmsMessage[]) => void;

  clearMessages: () => void;
};

function mergeMessagesById<T extends { id: string; date: number }>(
  existingMessages: T[],
  newMessages: T[]
): T[] {
  const messageMap = new Map<string, T>();

  for (const message of existingMessages) {
    messageMap.set(message.id, message);
  }

  for (const message of newMessages) {
    messageMap.set(message.id, message);
  }

  return Array.from(messageMap.values()).sort((a, b) => {
    return b.date - a.date;
  });
}

export const useSmsStore = create<SmsStore>()(
  persist(
    (set) => ({
      rawMessages: [],
      flaggedMessages: [],

      setRawMessages: (messages) => {
        set({
          rawMessages: messages,
        });
      },

      setFlaggedMessages: (messages) => {
        set({
          flaggedMessages: messages,
        });
      },

      appendRawMessages: (messages) => {
        set((state) => ({
          rawMessages: mergeMessagesById(
            state.rawMessages,
            messages
          ),
        }));
      },

      appendFlaggedMessages: (messages) => {
        set((state) => ({
          flaggedMessages: mergeMessagesById(
            state.flaggedMessages,
            messages
          ),
        }));
      },

      clearMessages: () => {
        set({
          rawMessages: [],
          flaggedMessages: [],
        });
      },
    }),
    {
      name: "sms-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);