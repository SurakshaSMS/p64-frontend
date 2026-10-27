
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import { scanAndStoreSmsMessages } from "./smsScan.service";
import { getSmsMessages } from "@/services/smsReader.service";
import { classifySmsMessages } from "@/ml/classifySmsMessages";
import { applySmsFlaggingRules } from "@/utils/smsFlagging.utils";
import { useSmsStore } from "@/stores/useSmsStore";

import type {
  MLSmsMessage,
  ClassifiedSmsMessage,
} from "@/types/message.type";

import type { FinalRiskResult } from "@/types/risk.type";

// --------------------------------------------------
// MOCK EXTERNAL DEPENDENCIES
// --------------------------------------------------

// Mock SMS retrieval because it depends on native Android APIs.
jest.mock("@/services/smsReader.service", () => ({
  getSmsMessages: jest.fn(),
}));

// Mock ML classification so no actual model is loaded.
jest.mock("@/ml/classifySmsMessages", () => ({
  classifySmsMessages: jest.fn(),
}));

// Mock risk calculation to isolate the scanning workflow.
jest.mock("@/utils/smsFlagging.utils", () => ({
  applySmsFlaggingRules: jest.fn(),
}));

// Mock device storage, but NOT the Zustand store.
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

const mockGetSmsMessages =
  getSmsMessages as jest.MockedFunction<typeof getSmsMessages>;

const mockClassifySmsMessages =
  classifySmsMessages as jest.MockedFunction<
    typeof classifySmsMessages
  >;

const mockApplySmsFlaggingRules =
  applySmsFlaggingRules as jest.MockedFunction<
    typeof applySmsFlaggingRules
  >;

// --------------------------------------------------
// TEST DATA: RAW SMS MESSAGES
// --------------------------------------------------

const sampleMessages: MLSmsMessage[] = [
  {
    id: "1",
    sender: "Bank",
    body: "Your account has been updated.",
    date: 1000,
    read: false,
  },
  {
    id: "2",
    sender: "Unknown",
    body: "Click this link to claim your prize.",
    date: 2000,
    read: false,
  },
];

// --------------------------------------------------
// TEST DATA: CLASSIFIED SMS MESSAGES
// --------------------------------------------------

const classifiedMessages: ClassifiedSmsMessage[] = [
  {
    ...sampleMessages[0],
    mlResult: {
      label: "normal",
      cleanedText: "Your account has been updated.",
      dangerScore: 0.1,
      confidence: 0.95,
      probabilities: {
        normal: 0.95,
        promo: 0.03,
        smish: 0.02,
      },
    },
  },
  {
    ...sampleMessages[1],
    mlResult: {
      label: "smish",
      cleanedText: "Click this link to claim your prize.",
      dangerScore: 0.95,
      confidence: 0.98,
      probabilities: {
        normal: 0.01,
        promo: 0.01,
        smish: 0.98,
      },
    },
  },
];

// --------------------------------------------------
// TEST DATA: RISK RESULTS
// --------------------------------------------------

const safeRiskResult: FinalRiskResult = {
  riskLevel: "safe",
  flags: [
    {
      source: "sender_rule",
      level: "safe",
      message: "Sender is in your safe sender list.",
    },
  ],
};

const highRiskResult: FinalRiskResult = {
  riskLevel: "high",
  flags: [
    {
      source: "ai_model",
      level: "high",
      message: "AI model classified this message as smishing.",
    },
  ],
};

// --------------------------------------------------
// UNIT TESTS: UT-07 TO UT-16
// --------------------------------------------------

describe("scanAndStoreSmsMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the REAL Zustand store before each test.
    useSmsStore.getState().clearMessages();

    // Mock SMS retrieval.
    mockGetSmsMessages.mockResolvedValue(sampleMessages);

    // Mock ML classification.
    mockClassifySmsMessages.mockResolvedValue(
      classifiedMessages
    );

    // Mock the risk calculation for each message.
    mockApplySmsFlaggingRules
      .mockReturnValueOnce(safeRiskResult)
      .mockReturnValueOnce(highRiskResult);
  });

  // UT-07
  it("UT-07: passes the specified SMS limit to the reader", async () => {
    await scanAndStoreSmsMessages(10);

    expect(mockGetSmsMessages).toHaveBeenCalledWith(10);
    expect(mockGetSmsMessages).toHaveBeenCalledTimes(1);
  });

  // UT-08
  it("UT-08: stores retrieved raw SMS messages in the real store", async () => {
    await scanAndStoreSmsMessages(10);

    const storedMessages =
      useSmsStore.getState().rawMessages;

    expect(storedMessages).toEqual(sampleMessages);
  });

  // UT-09
  it("UT-09: passes retrieved messages to the ML classifier", async () => {
    await scanAndStoreSmsMessages(10);

    expect(mockClassifySmsMessages).toHaveBeenCalledWith(
      sampleMessages
    );

    expect(mockClassifySmsMessages).toHaveBeenCalledTimes(1);
  });

  // UT-10
  it("UT-10: applies risk flagging rules to every classified message", async () => {
    await scanAndStoreSmsMessages(10);

    expect(mockApplySmsFlaggingRules).toHaveBeenCalledTimes(2);

    expect(mockApplySmsFlaggingRules).toHaveBeenNthCalledWith(
      1,
      classifiedMessages[0]
    );

    expect(mockApplySmsFlaggingRules).toHaveBeenNthCalledWith(
      2,
      classifiedMessages[1]
    );
  });

  // UT-11
  it("UT-11: assigns the correct finalRisk to each message", async () => {
    const result = await scanAndStoreSmsMessages(10);

    expect(result.flaggedMessages[0].finalRisk).toEqual(
      safeRiskResult
    );

    expect(result.flaggedMessages[1].finalRisk).toEqual(
      highRiskResult
    );
  });

  // UT-12
  it("UT-12: saves flagged SMS messages in the real store", async () => {
    const result = await scanAndStoreSmsMessages(10);

    const storedFlaggedMessages =
      useSmsStore.getState().flaggedMessages;

    expect(storedFlaggedMessages).toEqual(
      result.flaggedMessages
    );

    expect(storedFlaggedMessages).toHaveLength(2);
  });

  // UT-13
  it("UT-13: returns the complete flagged message objects", async () => {
    const result = await scanAndStoreSmsMessages(10);

    expect(result).toHaveProperty("flaggedMessages");
    expect(result.flaggedMessages).toHaveLength(2);

    expect(result.flaggedMessages[0]).toEqual({
      ...classifiedMessages[0],
      finalRisk: safeRiskResult,
    });

    expect(result.flaggedMessages[1]).toEqual({
      ...classifiedMessages[1],
      finalRisk: highRiskResult,
    });
  });

  // UT-14
  it("UT-14: handles an empty SMS message list", async () => {
    mockGetSmsMessages.mockResolvedValue([]);
    mockClassifySmsMessages.mockResolvedValue([]);

    const result = await scanAndStoreSmsMessages(10);

    expect(useSmsStore.getState().rawMessages).toEqual([]);
    expect(useSmsStore.getState().flaggedMessages).toEqual([]);

    expect(mockClassifySmsMessages).toHaveBeenCalledWith([]);
    expect(mockApplySmsFlaggingRules).not.toHaveBeenCalled();

    expect(result.flaggedMessages).toEqual([]);
  });

  // UT-15
  it("UT-15: rejects when SMS retrieval fails", async () => {
    const error = new Error("SMS retrieval failed");

    mockGetSmsMessages.mockRejectedValue(error);

    await expect(
      scanAndStoreSmsMessages(10)
    ).rejects.toThrow("SMS retrieval failed");

    // No messages should have been stored.
    expect(useSmsStore.getState().rawMessages).toEqual([]);
    expect(useSmsStore.getState().flaggedMessages).toEqual([]);

    expect(mockClassifySmsMessages).not.toHaveBeenCalled();
  });

  // UT-16
  it("UT-16: rejects when ML classification fails", async () => {
    const error = new Error("ML classification failed");

    mockClassifySmsMessages.mockRejectedValue(error);

    await expect(
      scanAndStoreSmsMessages(10)
    ).rejects.toThrow("ML classification failed");

    // Raw messages are saved before classification.
    expect(useSmsStore.getState().rawMessages).toEqual(
      sampleMessages
    );

    // Flagged messages should not be saved after failure.
    expect(useSmsStore.getState().flaggedMessages).toEqual([]);
  });
});
