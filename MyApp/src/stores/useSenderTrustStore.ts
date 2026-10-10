import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SenderRule } from "../types/senderRule.type";

type SenderStatus = "blocked" | "safe" | "unknown";

type SenderTrustStore = {
  blockedSenders: SenderRule[];
  safeSenders: SenderRule[];

  blockSender: (sender: string) => void;
  markSenderAsSafe: (sender: string) => void;

  unblockSender: (sender: string) => void;
  removeSafeSender: (sender: string) => void;

  isSenderBlocked: (sender: string) => boolean;
  isSenderSafe: (sender: string) => boolean;
  getSenderStatus: (sender: string) => SenderStatus;

  clearSenderRules: () => void;
};

function normalizeSender(sender: string): string {
  return sender.trim().toLowerCase();
}

function createSenderRule(sender: string): SenderRule {
  return {
    sender,
    normalizedSender: normalizeSender(sender),
    createdAt: Date.now(),
  };
}

export const useSenderTrustStore = create<SenderTrustStore>()(
  persist(
    (set, get) => ({
      blockedSenders: [],
      safeSenders: [],

      blockSender: (sender) => {
        const normalizedSender = normalizeSender(sender);

        set((state) => ({
          blockedSenders: [
            ...state.blockedSenders.filter(
              (item) => item.normalizedSender !== normalizedSender
            ),
            createSenderRule(sender),
          ],

          // If sender is blocked, remove it from safe list
          safeSenders: state.safeSenders.filter(
            (item) => item.normalizedSender !== normalizedSender
          ),
        }));
      },

      markSenderAsSafe: (sender) => {
        const normalizedSender = normalizeSender(sender);

        set((state) => ({
          safeSenders: [
            ...state.safeSenders.filter(
              (item) => item.normalizedSender !== normalizedSender
            ),
            createSenderRule(sender),
          ],

          // If sender is marked safe, remove it from blocked list
          blockedSenders: state.blockedSenders.filter(
            (item) => item.normalizedSender !== normalizedSender
          ),
        }));
      },

      unblockSender: (sender) => {
        const normalizedSender = normalizeSender(sender);

        set((state) => ({
          blockedSenders: state.blockedSenders.filter(
            (item) => item.normalizedSender !== normalizedSender
          ),
        }));
      },

      removeSafeSender: (sender) => {
        const normalizedSender = normalizeSender(sender);

        set((state) => ({
          safeSenders: state.safeSenders.filter(
            (item) => item.normalizedSender !== normalizedSender
          ),
        }));
      },

      isSenderBlocked: (sender) => {
        const normalizedSender = normalizeSender(sender);

        return get().blockedSenders.some(
          (item) => item.normalizedSender === normalizedSender
        );
      },

      isSenderSafe: (sender) => {
        const normalizedSender = normalizeSender(sender);

        return get().safeSenders.some(
          (item) => item.normalizedSender === normalizedSender
        );
      },

      getSenderStatus: (sender) => {
        const normalizedSender = normalizeSender(sender);

        const isBlocked = get().blockedSenders.some(
          (item) => item.normalizedSender === normalizedSender
        );

        if (isBlocked) {
          return "blocked";
        }

        const isSafe = get().safeSenders.some(
          (item) => item.normalizedSender === normalizedSender
        );

        if (isSafe) {
          return "safe";
        }

        return "unknown";
      },

      clearSenderRules: () => {
        set({
          blockedSenders: [],
          safeSenders: [],
        });
      },
    }),
    {
      name: "sender-trust-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);