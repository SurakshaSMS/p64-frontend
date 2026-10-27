
// src/stores/useSenderTrustStore.spec.ts

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import { useSenderTrustStore } from "./useSenderTrustStore";

// Mock AsyncStorage so tests do not use device storage.
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe("useSenderTrustStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset sender rules before every test.
    useSenderTrustStore.getState().clearSenderRules();
  });

  // UT-60
  it("UT-60: starts with empty blocked and safe sender lists", () => {
    const state = useSenderTrustStore.getState();

    expect(state.blockedSenders).toEqual([]);
    expect(state.safeSenders).toEqual([]);
  });

  // UT-61
  it("UT-61: adds a sender to the blocked list", () => {
    useSenderTrustStore.getState().blockSender("SpamSender");

    const blocked = useSenderTrustStore.getState().blockedSenders;

    expect(blocked).toHaveLength(1);
    expect(blocked[0].sender).toBe("SpamSender");
    expect(blocked[0].normalizedSender).toBe("spamsender");
    expect(blocked[0].createdAt).toEqual(expect.any(Number));
  });

  // UT-62
  it("UT-62: normalises blocked sender names", () => {
    useSenderTrustStore.getState().blockSender("  BANK  ");

    const blocked = useSenderTrustStore.getState().blockedSenders;

    expect(blocked[0].normalizedSender).toBe("bank");
  });

  // UT-63
  it("UT-63: prevents duplicate blocked senders", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("Bank");
    store.blockSender("BANK");
    store.blockSender(" bank ");

    const blocked = useSenderTrustStore.getState().blockedSenders;

    expect(blocked).toHaveLength(1);
    expect(blocked[0].normalizedSender).toBe("bank");
  });

  // UT-64
  it("UT-64: removes a sender from the safe list when blocked", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Bank");
    store.blockSender("BANK");

    const state = useSenderTrustStore.getState();

    expect(state.safeSenders).toHaveLength(0);
    expect(state.blockedSenders).toHaveLength(1);
    expect(state.getSenderStatus("bank")).toBe("blocked");
  });

  // UT-65
  it("UT-65: adds a sender to the safe list", () => {
    useSenderTrustStore.getState().markSenderAsSafe("Friend");

    const safe = useSenderTrustStore.getState().safeSenders;

    expect(safe).toHaveLength(1);
    expect(safe[0].sender).toBe("Friend");
    expect(safe[0].normalizedSender).toBe("friend");
    expect(safe[0].createdAt).toEqual(expect.any(Number));
  });

  // UT-66
  it("UT-66: normalises safe sender names", () => {
    useSenderTrustStore.getState().markSenderAsSafe("  FAMILY  ");

    const safe = useSenderTrustStore.getState().safeSenders;

    expect(safe[0].normalizedSender).toBe("family");
  });

  // UT-67
  it("UT-67: prevents duplicate safe senders", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Friend");
    store.markSenderAsSafe("FRIEND");
    store.markSenderAsSafe(" friend ");

    const safe = useSenderTrustStore.getState().safeSenders;

    expect(safe).toHaveLength(1);
    expect(safe[0].normalizedSender).toBe("friend");
  });

  // UT-68
  it("UT-68: removes a sender from the blocked list when marked safe", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("Bank");
    store.markSenderAsSafe("BANK");

    const state = useSenderTrustStore.getState();

    expect(state.blockedSenders).toHaveLength(0);
    expect(state.safeSenders).toHaveLength(1);
    expect(state.getSenderStatus("bank")).toBe("safe");
  });

  // UT-69
  it("UT-69: unblocks an existing blocked sender", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("SpamSender");
    store.unblockSender("SpamSender");

    expect(useSenderTrustStore.getState().blockedSenders).toEqual([]);
    expect(useSenderTrustStore.getState().isSenderBlocked("SpamSender")).toBe(false);
  });

  // UT-70
  it("UT-70: unblocking an unknown sender leaves existing rules unchanged", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("SpamSender");
    store.unblockSender("UnknownSender");

    expect(useSenderTrustStore.getState().blockedSenders).toHaveLength(1);
    expect(useSenderTrustStore.getState().isSenderBlocked("SpamSender")).toBe(true);
  });

  // UT-71
  it("UT-71: removes an existing safe sender", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Friend");
    store.removeSafeSender("Friend");

    expect(useSenderTrustStore.getState().safeSenders).toEqual([]);
    expect(useSenderTrustStore.getState().isSenderSafe("Friend")).toBe(false);
  });

  // UT-72
  it("UT-72: removing an unknown safe sender leaves existing rules unchanged", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Friend");
    store.removeSafeSender("UnknownSender");

    expect(useSenderTrustStore.getState().safeSenders).toHaveLength(1);
    expect(useSenderTrustStore.getState().isSenderSafe("Friend")).toBe(true);
  });

  // UT-73
  it("UT-73: identifies blocked senders regardless of case or spaces", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("Bank");

    expect(store.isSenderBlocked("bank")).toBe(true);
    expect(store.isSenderBlocked(" BANK ")).toBe(true);
    expect(store.isSenderBlocked("Friend")).toBe(false);
  });

  // UT-74
  it("UT-74: identifies safe senders regardless of case or spaces", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Friend");

    expect(store.isSenderSafe("friend")).toBe(true);
    expect(store.isSenderSafe(" FRIEND ")).toBe(true);
    expect(store.isSenderSafe("SpamSender")).toBe(false);
  });

  // UT-75
  it("UT-75: returns blocked status for a blocked sender", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("SpamSender");

    expect(store.getSenderStatus("spamsender")).toBe("blocked");
  });

  // UT-76
  it("UT-76: returns safe status for a trusted sender", () => {
    const store = useSenderTrustStore.getState();

    store.markSenderAsSafe("Friend");

    expect(store.getSenderStatus("friend")).toBe("safe");
  });

  // UT-77
  it("UT-77: returns unknown status for an unregistered sender", () => {
    const store = useSenderTrustStore.getState();

    expect(store.getSenderStatus("UnknownSender")).toBe("unknown");
  });

  // UT-78
  it("UT-78: clears all blocked and safe sender rules", () => {
    const store = useSenderTrustStore.getState();

    store.blockSender("SpamSender");
    store.markSenderAsSafe("Friend");

    store.clearSenderRules();

    const state = useSenderTrustStore.getState();

    expect(state.blockedSenders).toEqual([]);
    expect(state.safeSenders).toEqual([]);
    expect(state.getSenderStatus("SpamSender")).toBe("unknown");
    expect(state.getSenderStatus("Friend")).toBe("unknown");
  });
});
