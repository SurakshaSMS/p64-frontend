
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import { useSmsStore } from "./useSmsStore";

import type {
  SmsMessage,
  FlaggedSmsMessage,
} from "@/types/message.type";

// Mock AsyncStorage to avoid accessing device storage.
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

// --------------------------------------------------
// TEST DATA: RAW SMS MESSAGES
// --------------------------------------------------

const rawMessage1: SmsMessage = {
  id: "sms-1",
  sender: "Bank",
  body: "Your account has been updated.",
  date: 1000,
  read: false,
};

const rawMessage2: SmsMessage = {
  id: "sms-2",
  sender: "Friend",
  body: "Hello!",
  date: 3000,
  read: true,
};

const rawMessage3: SmsMessage = {
  id: "sms-3",
  sender: "Delivery",
  body: "Your parcel is arriving today.",
  date: 2000,
  read: false,
};

// --------------------------------------------------
// TEST DATA: FLAGGED SMS MESSAGES
// --------------------------------------------------

const flaggedMessage1: FlaggedSmsMessage = {
  ...rawMessage1,
  mlResult: {
    label: "smish",
    cleanedText: "Your account has been updated.",
    dangerScore: 0.9,
    confidence: 0.92,
    probabilities: {
      normal: 0.03,
      promo: 0.05,
      smish: 0.92,
    },
  },
  finalRisk: {
    riskLevel: "high",
    flags: [
      {
        source: "ai_model",
        level: "high",
        message: "SMS classified as a potential smishing attempt.",
      },
    ],
  },
};

const flaggedMessage2: FlaggedSmsMessage = {
  ...rawMessage2,
  mlResult: {
    label: "normal",
    cleanedText: "Hello!",
    dangerScore: 0.1,
    confidence: 0.95,
    probabilities: {
      normal: 0.95,
      promo: 0.03,
      smish: 0.02,
    },
  },
  finalRisk: {
    riskLevel: "safe",
    flags: [],
  },
};

const flaggedMessage3: FlaggedSmsMessage = {
  ...rawMessage3,
  mlResult: {
    label: "promo",
    cleanedText: "Your parcel is arriving today.",
    dangerScore: 0.4,
    confidence: 0.85,
    probabilities: {
      normal: 0.1,
      promo: 0.85,
      smish: 0.05,
    },
  },
  finalRisk: {
    riskLevel: "medium",
    flags: [
      {
        source: "ai_model",
        level: "medium",
        message: "Promotional SMS requires further review.",
      },
    ],
  },
};

// --------------------------------------------------
// UNIT TESTS: UT-79 TO UT-93
// --------------------------------------------------

describe("useSmsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset both collections before every test.
    useSmsStore.setState({
      rawMessages: [],
      flaggedMessages: [],
    });
  });

  // UT-79
  it("UT-79: starts with empty raw and flagged message lists", () => {
    const state = useSmsStore.getState();

    expect(state.rawMessages).toEqual([]);
    expect(state.flaggedMessages).toEqual([]);
  });

  // UT-80
  it("UT-80: stores raw SMS messages", () => {
    useSmsStore.getState().setRawMessages([
      rawMessage1,
      rawMessage2,
    ]);

    expect(useSmsStore.getState().rawMessages).toEqual([
      rawMessage1,
      rawMessage2,
    ]);
  });

  // UT-81
  it("UT-81: replaces existing raw SMS messages", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);
    store.setRawMessages([rawMessage2]);

    expect(useSmsStore.getState().rawMessages).toEqual([
      rawMessage2,
    ]);
  });

  // UT-82
  it("UT-82: stores flagged SMS messages", () => {
    useSmsStore.getState().setFlaggedMessages([
      flaggedMessage1,
      flaggedMessage2,
    ]);

    expect(useSmsStore.getState().flaggedMessages).toEqual([
      flaggedMessage1,
      flaggedMessage2,
    ]);
  });

  // UT-83
  it("UT-83: replaces existing flagged SMS messages", () => {
    const store = useSmsStore.getState();

    store.setFlaggedMessages([flaggedMessage1]);
    store.setFlaggedMessages([flaggedMessage2]);

    expect(useSmsStore.getState().flaggedMessages).toEqual([
      flaggedMessage2,
    ]);
  });

  // UT-84
  it("UT-84: appends new raw SMS messages", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);
    store.appendRawMessages([rawMessage2]);

    const result = useSmsStore.getState().rawMessages;

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(rawMessage1);
    expect(result).toContainEqual(rawMessage2);
  });

  // UT-85
  it("UT-85: prevents duplicate raw SMS message IDs", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);
    store.appendRawMessages([rawMessage1]);

    expect(useSmsStore.getState().rawMessages).toHaveLength(1);
  });

  // UT-86
  it("UT-86: updates a raw SMS message with an existing ID", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);

    const updatedMessage: SmsMessage = {
      ...rawMessage1,
      body: "Updated account notification.",
      date: 4000,
    };

    store.appendRawMessages([updatedMessage]);

    expect(useSmsStore.getState().rawMessages).toEqual([
      updatedMessage,
    ]);
  });

  // UT-87
  it("UT-87: sorts appended raw SMS messages by newest date first", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);

    store.appendRawMessages([
      rawMessage3,
      rawMessage2,
    ]);

    const result = useSmsStore.getState().rawMessages;

    expect(result.map((message) => message.id)).toEqual([
      "sms-2",
      "sms-3",
      "sms-1",
    ]);
  });

  // UT-88
  it("UT-88: appends new flagged SMS messages", () => {
    const store = useSmsStore.getState();

    store.setFlaggedMessages([flaggedMessage1]);
    store.appendFlaggedMessages([flaggedMessage2]);

    const result = useSmsStore.getState().flaggedMessages;

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(flaggedMessage1);
    expect(result).toContainEqual(flaggedMessage2);
  });

  // UT-89
  it("UT-89: prevents duplicate flagged SMS message IDs", () => {
    const store = useSmsStore.getState();

    store.setFlaggedMessages([flaggedMessage1]);
    store.appendFlaggedMessages([flaggedMessage1]);

    expect(useSmsStore.getState().flaggedMessages).toHaveLength(1);
  });

  // UT-90
  it("UT-90: updates a flagged SMS message with an existing ID", () => {
    const store = useSmsStore.getState();

    store.setFlaggedMessages([flaggedMessage1]);

    const updatedMessage: FlaggedSmsMessage = {
      ...flaggedMessage1,
      date: 4000,
      mlResult: {
        ...flaggedMessage1.mlResult,
        dangerScore: 0.95,
      },
    };

    store.appendFlaggedMessages([updatedMessage]);

    expect(useSmsStore.getState().flaggedMessages).toEqual([
      updatedMessage,
    ]);
  });

  // UT-91
  it("UT-91: sorts appended flagged SMS messages by newest date first", () => {
    const store = useSmsStore.getState();

    store.setFlaggedMessages([flaggedMessage1]);

    store.appendFlaggedMessages([
      flaggedMessage3,
      flaggedMessage2,
    ]);

    const result = useSmsStore.getState().flaggedMessages;

    expect(result.map((message) => message.id)).toEqual([
      "sms-2",
      "sms-3",
      "sms-1",
    ]);
  });

  // UT-92
  it("UT-92: keeps raw and flagged message collections independent", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([rawMessage1]);
    store.setFlaggedMessages([flaggedMessage2]);

    store.appendRawMessages([rawMessage3]);

    const state = useSmsStore.getState();

    expect(state.rawMessages).toHaveLength(2);
    expect(state.flaggedMessages).toEqual([
      flaggedMessage2,
    ]);
  });

  // UT-93
  it("UT-93: clears both raw and flagged SMS messages", () => {
    const store = useSmsStore.getState();

    store.setRawMessages([
      rawMessage1,
      rawMessage2,
    ]);

    store.setFlaggedMessages([
      flaggedMessage1,
      flaggedMessage2,
    ]);

    store.clearMessages();

    const state = useSmsStore.getState();

    expect(state.rawMessages).toEqual([]);
    expect(state.flaggedMessages).toEqual([]);
  });
});
