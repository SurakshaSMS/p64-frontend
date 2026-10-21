// src/services/smsReader.service.spec.ts

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";

import { PermissionsAndroid, Platform } from "react-native";

import {
  requestSmsPermission,
  getSmsMessages,
} from "./smsReader.service";

// Mock the native SMS reader BEFORE it is loaded.
// This prevents Expo native modules from running during unit tests.
jest.mock("../../modules/sms-reader/src/SmsReaderModule", () => ({
  __esModule: true,
  default: {
    getMessages: jest.fn(),
  },
}));

// Mock React Native permissions.
jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      READ_SMS: "android.permission.READ_SMS",
      RECEIVE_SMS: "android.permission.RECEIVE_SMS",
    },
    RESULTS: {
      GRANTED: "granted",
      DENIED: "denied",
    },
    requestMultiple: jest.fn(),
  },
}));

// Import the mocked SMS reader.
// The import is safe because Jest replaces the module with our mock.
import SmsReader from "../../modules/sms-reader/src/SmsReaderModule";

// Access the mocked functions.
const mockGetMessages = jest.mocked(SmsReader.getMessages);

const mockRequestMultiple = jest.mocked(
  PermissionsAndroid.requestMultiple
);

// Permission values.
const granted = PermissionsAndroid.RESULTS.GRANTED;
const denied = PermissionsAndroid.RESULTS.DENIED;

const readPermission = PermissionsAndroid.PERMISSIONS.READ_SMS;
const receivePermission =
  PermissionsAndroid.PERMISSIONS.RECEIVE_SMS;

// Sample SMS messages.
const sampleMessages = [
  {
    id: 1,
    sender: "Bank",
    body: "Your account has been updated.",
    date: 1000,
    read: false,
  },
  {
    id: 2,
    sender: "Friend",
    body: "Hello!",
    date: 2000,
    read: true,
  },
];

describe("smsReader.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the platform to Android before each test.
    Platform.OS = "android";

    // Suppress expected console messages.
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // UT-17
  it("UT-17: returns false when the platform is not Android", async () => {
    Platform.OS = "ios";

    const result = await requestSmsPermission();

    expect(result).toBe(false);
    expect(mockRequestMultiple).not.toHaveBeenCalled();
  });

  // UT-18
  it("UT-18: requests READ_SMS and RECEIVE_SMS permissions", async () => {
    mockRequestMultiple.mockResolvedValue({
      [readPermission]: granted,
      [receivePermission]: granted,
    } as any);

    await requestSmsPermission();

    expect(mockRequestMultiple).toHaveBeenCalledWith([
      readPermission,
      receivePermission,
    ]);
  });

  // UT-19
  it("UT-19: returns true when both permissions are granted", async () => {
    mockRequestMultiple.mockResolvedValue({
      [readPermission]: granted,
      [receivePermission]: granted,
    } as any);

    const result = await requestSmsPermission();

    expect(result).toBe(true);
  });

  // UT-20
  it("UT-20: returns false when READ_SMS is denied", async () => {
    mockRequestMultiple.mockResolvedValue({
      [readPermission]: denied,
      [receivePermission]: granted,
    } as any);

    const result = await requestSmsPermission();

    expect(result).toBe(false);
  });

  // UT-21
  it("UT-21: returns false when RECEIVE_SMS is denied", async () => {
    mockRequestMultiple.mockResolvedValue({
      [readPermission]: granted,
      [receivePermission]: denied,
    } as any);

    const result = await requestSmsPermission();

    expect(result).toBe(false);
  });

  // UT-22
  it("UT-22: returns false when both permissions are denied", async () => {
    mockRequestMultiple.mockResolvedValue({
      [readPermission]: denied,
      [receivePermission]: denied,
    } as any);

    const result = await requestSmsPermission();

    expect(result).toBe(false);
  });

  // UT-23
  it("UT-23: passes the requested limit to the native SMS reader", async () => {
    mockGetMessages.mockResolvedValue([]);

    await getSmsMessages(10);

    expect(mockGetMessages).toHaveBeenCalledWith(10);
  });

  // UT-24
  it("UT-24: returns valid retrieved SMS messages", async () => {
    mockGetMessages.mockResolvedValue(sampleMessages as any);

    const result = await getSmsMessages(10);

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      id: "1",
      sender: "Bank",
      body: "Your account has been updated.",
      date: 1000,
      read: false,
    });

    expect(result[1]).toEqual({
      id: "2",
      sender: "Friend",
      body: "Hello!",
      date: 2000,
      read: true,
    });
  });

  // UT-25
  it("UT-25: filters out empty and whitespace-only SMS bodies", async () => {
    mockGetMessages.mockResolvedValue([
      {
        id: 1,
        sender: "Bank",
        body: "",
        date: 1000,
        read: false,
      },
      {
        id: 2,
        sender: "Friend",
        body: "   ",
        date: 2000,
        read: false,
      },
    ] as any);

    const result = await getSmsMessages(10);

    expect(result).toEqual([]);
  });

  // UT-26
  it("UT-26: filters SMS messages with non-string bodies", async () => {
    mockGetMessages.mockResolvedValue([
      {
        id: 1,
        sender: "Bank",
        body: null,
        date: 1000,
        read: false,
      },
      {
        id: 2,
        sender: "Friend",
        body: 12345,
        date: 2000,
        read: false,
      },
      {
        id: 3,
        sender: "Family",
        body: "Valid message",
        date: 3000,
        read: true,
      },
    ] as any);

    const result = await getSmsMessages(10);

    expect(result).toHaveLength(1);
    expect(result[0].body).toBe("Valid message");
  });

  // UT-27
  it("UT-27: converts SMS IDs, dates and read status correctly", async () => {
    mockGetMessages.mockResolvedValue([
      {
        id: 123,
        sender: "Bank",
        body: "Test message",
        date: "1700000000",
        read: 1,
      },
    ] as any);

    const result = await getSmsMessages(10);

    expect(result[0].id).toBe("123");
    expect(result[0].date).toBe(1700000000);
    expect(result[0].read).toBe(true);
  });

  // UT-28
  it("UT-28: assigns Unknown when the sender is missing", async () => {
    mockGetMessages.mockResolvedValue([
      {
        id: 1,
        sender: null,
        body: "Message without sender",
        date: 1000,
        read: false,
      },
    ] as any);

    const result = await getSmsMessages(10);

    expect(result[0].sender).toBe("Unknown");
  });

  // UT-29
  it("UT-29: rejects when native SMS retrieval fails", async () => {
    mockGetMessages.mockRejectedValue(
      new Error("SMS retrieval failed")
    );

    await expect(getSmsMessages(10)).rejects.toThrow(
      "SMS retrieval failed"
    );
  });
});