import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBundledOnnxModelPath } from "@/services/modelAsset.service";

const MODEL_CACHE_KEY = "local_onnx_model_path_v1";

export async function prepareLocalModelFile(): Promise<string> {
  const existingModelPath = await AsyncStorage.getItem(MODEL_CACHE_KEY);

  if (existingModelPath) {
    return existingModelPath;
  }

  const modelPath = await getBundledOnnxModelPath();

  await AsyncStorage.setItem(MODEL_CACHE_KEY, modelPath);

  return modelPath;
}

export async function getCachedModelPath(): Promise<string | null> {
  return AsyncStorage.getItem(MODEL_CACHE_KEY);
}