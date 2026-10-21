// src/stores/useAlertStore.spec.ts

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import { useAlertStore } from "./useAlertStore";
import type { AlertItem } from "@/types/alert.type";

// Mock AsyncStorage so tests do not require device storage.
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

// Sample alerts used in unit tests.

const alert1: AlertItem = {
  id: "alert-1",
  sender: "Bank",
  source: "SMS",
  time: "10:00 AM",
  date: "21/10/2026",
  timestamp: 1000,
  score: 0.9,
  unread: true,
  dismissed: false,
};

const alert2: AlertItem = {
  id: "alert-2",
  sender: "Unknown",
  source: "SMS",
  time: "11:00 AM",
  date: "21/10/2026",
  timestamp: 3000,
  score: 0.7,
  unread: true,
  dismissed: false,
};

const alert3: AlertItem = {
  id: "alert-3",
  sender: "Delivery",
  source: "SMS",
  time: "10:30 AM",
  date: "21/10/2026",
  timestamp: 2000,
  score: 0.8,
  unread: true,
  dismissed: false,
};

describe("useAlertStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the Zustand store before every test.
    useAlertStore.setState({
      alertItems: [],
    });
  });

  // UT-47
  it("UT-47: starts with an empty alert list", () => {
    expect(useAlertStore.getState().alertItems).toEqual([]);
  });

  // UT-48
  it("UT-48: sets alert items successfully", () => {
    useAlertStore.getState().setAlertItems([alert1, alert2]);

    const result = useAlertStore.getState().alertItems;

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(alert1);
    expect(result).toContainEqual(alert2);
  });

  // UT-49
  it("UT-49: sorts alerts by timestamp in descending order", () => {
    useAlertStore.getState().setAlertItems([
      alert1,
      alert2,
      alert3,
    ]);

    const result = useAlertStore.getState().alertItems;

    expect(result.map((alert) => alert.id)).toEqual([
      "alert-2",
      "alert-3",
      "alert-1",
    ]);
  });

  // UT-50
  it("UT-50: replaces existing alerts when setting new items", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().setAlertItems([alert2]);

    expect(useAlertStore.getState().alertItems).toEqual([
      alert2,
    ]);
  });

  // UT-51
  it("UT-51: appends new alerts to the existing list", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().appendAlertItems([alert2]);

    const result = useAlertStore.getState().alertItems;

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(alert1);
    expect(result).toContainEqual(alert2);
  });

  // UT-52
  it("UT-52: prevents duplicate alert IDs when appending", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().appendAlertItems([alert1]);

    expect(useAlertStore.getState().alertItems).toHaveLength(1);
  });

  // UT-53
  it("UT-53: updates an existing alert when the same ID is appended", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    const updatedAlert = {
      ...alert1,
      unread: false,
      timestamp: 4000,
    };

    useAlertStore.getState().appendAlertItems([updatedAlert]);

    const result = useAlertStore.getState().alertItems;

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(updatedAlert);
  });

  // UT-54
  it("UT-54: sorts alerts after appending new items", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().appendAlertItems([
      alert3,
      alert2,
    ]);

    const result = useAlertStore.getState().alertItems;

    expect(result.map((alert) => alert.id)).toEqual([
      "alert-2",
      "alert-3",
      "alert-1",
    ]);
  });

  // UT-55
  it("UT-55: marks a matching alert as read", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().markAlertAsRead("alert-1");

    expect(useAlertStore.getState().alertItems[0].unread).toBe(
      false
    );
  });

  // UT-56
  it("UT-56: does not change other alerts when marking one as read", () => {
    useAlertStore.getState().setAlertItems([
      alert1,
      alert2,
    ]);

    useAlertStore.getState().markAlertAsRead("alert-1");

    const result = useAlertStore.getState().alertItems;

    expect(
      result.find((alert) => alert.id === "alert-1")?.unread
    ).toBe(false);

    expect(
      result.find((alert) => alert.id === "alert-2")?.unread
    ).toBe(true);
  });

  // UT-57
  it("UT-57: dismisses a matching alert", () => {
    useAlertStore.getState().setAlertItems([alert1]);

    useAlertStore.getState().dismissAlert("alert-1");

    expect(
      useAlertStore.getState().alertItems[0].dismissed
    ).toBe(true);
  });

  // UT-58
  it("UT-58: does not change other alerts when dismissing one", () => {
    useAlertStore.getState().setAlertItems([
      alert1,
      alert2,
    ]);

    useAlertStore.getState().dismissAlert("alert-1");

    const result = useAlertStore.getState().alertItems;

    expect(
      result.find((alert) => alert.id === "alert-1")?.dismissed
    ).toBe(true);

    expect(
      result.find((alert) => alert.id === "alert-2")?.dismissed
    ).toBe(false);
  });

  // UT-59
  it("UT-59: clears all alert items", () => {
    useAlertStore.getState().setAlertItems([
      alert1,
      alert2,
      alert3,
    ]);

    useAlertStore.getState().clearAlertItems();

    expect(useAlertStore.getState().alertItems).toEqual([]);
  });
});