// src/services/modelAsset.service.spec.ts

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import { NativeModules, Platform } from "react-native";

import { getBundledOnnxModelPath } from "./modelAsset.service";

// Mock React Native so tests do not require a real Android device.
jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  NativeModules: {
    ModelAssetModule: {
      copyOnnxModelToFiles: jest.fn(),
    },
  },
}));

const mockCopyOnnxModelToFiles = jest.mocked(
  NativeModules.ModelAssetModule.copyOnnxModelToFiles
);

const modelPath = "/data/user/0/com.suraksha/files/model.onnx";

describe("modelAsset.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Restore Android as the default platform.
    Platform.OS = "android";

    // Restore the native copying function.
    NativeModules.ModelAssetModule.copyOnnxModelToFiles =
      mockCopyOnnxModelToFiles;
  });

  // UT-30
  it("UT-30: returns the bundled ONNX model path on Android", async () => {
    mockCopyOnnxModelToFiles.mockResolvedValue(modelPath);

    const result = await getBundledOnnxModelPath();

    expect(result).toBe(modelPath);
  });

  // UT-31
  it("UT-31: calls the native model copying function", async () => {
    mockCopyOnnxModelToFiles.mockResolvedValue(modelPath);

    await getBundledOnnxModelPath();

    expect(mockCopyOnnxModelToFiles).toHaveBeenCalledTimes(1);
    expect(mockCopyOnnxModelToFiles).toHaveBeenCalledWith();
  });

  // UT-32
  it("UT-32: rejects when the platform is not Android", async () => {
    Platform.OS = "ios";

    await expect(getBundledOnnxModelPath()).rejects.toThrow(
      "Bundled ONNX model is only configured for Android."
    );

    expect(mockCopyOnnxModelToFiles).not.toHaveBeenCalled();
  });

  // UT-33
it("UT-33: rejects when ModelAssetModule is unavailable", async () => {
  const originalCopyFunction =
    NativeModules.ModelAssetModule.copyOnnxModelToFiles;

  try {
    // Simulate the native module being unavailable.
    NativeModules.ModelAssetModule.copyOnnxModelToFiles = undefined;

    await expect(getBundledOnnxModelPath()).rejects.toThrow(
      "ModelAssetModule is not available."
    );
  } finally {
    // Restore the native function after the test.
    NativeModules.ModelAssetModule.copyOnnxModelToFiles =
      originalCopyFunction;
  }
});

  // UT-34
  it("UT-34: rejects when the native copying function is unavailable", async () => {
    const originalFunction =
      NativeModules.ModelAssetModule.copyOnnxModelToFiles;

    try {
      NativeModules.ModelAssetModule.copyOnnxModelToFiles = undefined;

      await expect(getBundledOnnxModelPath()).rejects.toThrow(
        "ModelAssetModule is not available."
      );
    } finally {
      NativeModules.ModelAssetModule.copyOnnxModelToFiles =
        originalFunction;
    }
  });

  // UT-35
  it("UT-35: rejects when the native module returns an empty model path", async () => {
    mockCopyOnnxModelToFiles.mockResolvedValue("");

    await expect(getBundledOnnxModelPath()).rejects.toThrow(
      "Failed to resolve bundled ONNX model path."
    );
  });

  // UT-36
  it("UT-36: propagates errors when native model copying fails", async () => {
    mockCopyOnnxModelToFiles.mockRejectedValue(
      new Error("Failed to copy ONNX model")
    );

    await expect(getBundledOnnxModelPath()).rejects.toThrow(
      "Failed to copy ONNX model"
    );
  });
});