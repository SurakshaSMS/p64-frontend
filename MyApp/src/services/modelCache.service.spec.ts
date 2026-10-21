// src/services/modelCache.service.spec.ts

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
} from "@jest/globals";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getBundledOnnxModelPath,
} from "./modelAsset.service";

import {
  prepareLocalModelFile,
  getCachedModelPath,
} from "./modelCache.service";

// Mock AsyncStorage so tests do not access real device storage.
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

// Mock the bundled ONNX model service.
jest.mock("./modelAsset.service", () => ({
  getBundledOnnxModelPath: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

const mockGetBundledOnnxModelPath =
  getBundledOnnxModelPath as jest.Mock;

const MODEL_CACHE_KEY = "local_onnx_model_path_v1";

const cachedModelPath =
  "/data/user/0/com.suraksha/files/cached-model.onnx";

const bundledModelPath =
  "/data/user/0/com.suraksha/files/model.onnx";

describe("modelCache.service", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Default: no model has been cached.
    mockGetItem.mockResolvedValue(null as never);

    // Default: bundled model can be retrieved.
    mockGetBundledOnnxModelPath.mockResolvedValue(
      bundledModelPath as never
    );

    // Default: saving to storage succeeds.
    mockSetItem.mockResolvedValue(undefined as never);
  });

  // UT-37
  it("UT-37: returns an existing cached model path", async () => {
    mockGetItem.mockResolvedValue(cachedModelPath as never);

    const result = await prepareLocalModelFile();

    expect(result).toBe(cachedModelPath);
  });

  // UT-38
  it("UT-38: reads the model path using the correct cache key", async () => {
    await prepareLocalModelFile();

    expect(mockGetItem).toHaveBeenCalledWith(
      MODEL_CACHE_KEY
    );
  });

  // UT-39
  it("UT-39: does not copy the bundled model when a cached path exists", async () => {
    mockGetItem.mockResolvedValue(cachedModelPath as never);

    await prepareLocalModelFile();

    expect(mockGetBundledOnnxModelPath).not.toHaveBeenCalled();
  });

  // UT-40
  it("UT-40: retrieves the bundled model when no cached path exists", async () => {
    mockGetItem.mockResolvedValue(null as never);

    const result = await prepareLocalModelFile();

    expect(mockGetBundledOnnxModelPath).toHaveBeenCalledTimes(1);
    expect(result).toBe(bundledModelPath);
  });

  // UT-41
  it("UT-41: saves the bundled model path using the correct cache key", async () => {
    await prepareLocalModelFile();

    expect(mockSetItem).toHaveBeenCalledWith(
      MODEL_CACHE_KEY,
      bundledModelPath
    );
  });

  // UT-42
  it("UT-42: does not overwrite storage when a cached model exists", async () => {
    mockGetItem.mockResolvedValue(cachedModelPath as never);

    await prepareLocalModelFile();

    expect(mockSetItem).not.toHaveBeenCalled();
  });

  // UT-43
  it("UT-43: treats an empty cached path as missing", async () => {
    mockGetItem.mockResolvedValue("" as never);

    const result = await prepareLocalModelFile();

    expect(mockGetBundledOnnxModelPath).toHaveBeenCalledTimes(1);

    expect(mockSetItem).toHaveBeenCalledWith(
      MODEL_CACHE_KEY,
      bundledModelPath
    );

    expect(result).toBe(bundledModelPath);
  });

  // UT-44
  it("UT-44: propagates errors when reading cached storage fails", async () => {
    mockGetItem.mockRejectedValue(
      new Error("Storage read failed") as never
    );

    await expect(prepareLocalModelFile()).rejects.toThrow(
      "Storage read failed"
    );

    expect(mockGetBundledOnnxModelPath).not.toHaveBeenCalled();
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  // UT-45
  it("UT-45: propagates errors when retrieving the bundled model fails", async () => {
    mockGetBundledOnnxModelPath.mockRejectedValue(
      new Error("Model retrieval failed") as never
    );

    await expect(prepareLocalModelFile()).rejects.toThrow(
      "Model retrieval failed"
    );

    expect(mockSetItem).not.toHaveBeenCalled();
  });

  // UT-46
  it("UT-46: retrieves the cached model path without copying the model", async () => {
    mockGetItem.mockResolvedValue(cachedModelPath as never);

    const result = await getCachedModelPath();

    expect(mockGetItem).toHaveBeenCalledWith(
      MODEL_CACHE_KEY
    );

    expect(result).toBe(cachedModelPath);

    expect(mockGetBundledOnnxModelPath).not.toHaveBeenCalled();
    expect(mockSetItem).not.toHaveBeenCalled();
  });
});