import { NativeModules, Platform } from "react-native";

const { ModelAssetModule } = NativeModules;

export async function getBundledOnnxModelPath(): Promise<string> {
  if (Platform.OS !== "android") {
    throw new Error("Bundled ONNX model is only configured for Android.");
  }

  if (!ModelAssetModule?.copyOnnxModelToFiles) {
    throw new Error("ModelAssetModule is not available.");
  }

  const modelPath = await ModelAssetModule.copyOnnxModelToFiles();

  if (!modelPath) {
    throw new Error("Failed to resolve bundled ONNX model path.");
  }

  return modelPath;
}