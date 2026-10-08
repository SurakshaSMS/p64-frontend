import * as ort from "onnxruntime-react-native";
import { Asset } from "expo-asset";
import { getCachedModelPath, prepareLocalModelFile } from "@/services/modelCache.service";
import { tokenizeSms } from "./tokenizesms";

const MAX_LENGTH = 64;
let session: ort.InferenceSession | null = null;

const idToLabel: Record<number, "normal" | "promo" | "smish"> = {
  0: "normal",
  1: "promo",
  2: "smish",
};

function toInt64Tensor(values: number[]) {
  return new ort.Tensor(
    "int64",
    BigInt64Array.from(values.map((value) => BigInt(value))),
    [1, MAX_LENGTH]
  );
}

function softmax(logits: number[]) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - maxLogit));
  const sum = exps.reduce((acc, value) => acc + value, 0);

  return exps.map((value) => value / sum);
}

function calculateDangerScore(probabilities: number[]) {
  const normalProb = probabilities[0];
  const promoProb = probabilities[1];
  const smishProb = probabilities[2];

  return Number(
    (normalProb * 0 + promoProb * 40 + smishProb * 100).toFixed(2)
  );
}

export async function loadSmishingModel() {
  if (session) {
    return session;
  }

  let modelPath = await getCachedModelPath();

  if (!modelPath) {
    modelPath = await prepareLocalModelFile();
  }

  session = await ort.InferenceSession.create(modelPath);

  return session;
}
export async function predictSms(text: string) {
  const currentSession = await loadSmishingModel();

  const { cleanedText, inputIds, attentionMask, tokenTypeIds, tokens } =
    tokenizeSms(text);

  const feeds: Record<string, ort.Tensor> = {
    input_ids: toInt64Tensor(inputIds),
    attention_mask: toInt64Tensor(attentionMask),
    token_type_ids: toInt64Tensor(tokenTypeIds),
  };

  const output = await currentSession.run(feeds);

  const logitsTensor = output.logits;
  const logits = Array.from(logitsTensor.data as Float32Array);

  const probabilities = softmax(logits);
  const predictedId = probabilities.indexOf(Math.max(...probabilities));
  const label = idToLabel[predictedId];

  return {
    label,
    cleanedText,
    tokens,
    dangerScore: calculateDangerScore(probabilities),
    confidence: Number(probabilities[predictedId].toFixed(4)),
    probabilities: {
      normal: Number(probabilities[0].toFixed(4)),
      promo: Number(probabilities[1].toFixed(4)),
      smish: Number(probabilities[2].toFixed(4)),
    },
  };
}