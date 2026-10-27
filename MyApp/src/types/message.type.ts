import { FinalRiskResult } from "./risk.type";

export type RiskType = 'smish' | 'normal' | 'promo';
export type MessageItem = {
  id: string;
  sender: string;
  time: string;
  text: string;
  risk: RiskType;
  score: number;
};

export type MLSmsMessage = {
  id: string;
  body: string ;
  date: number;
  read: boolean;
  sender: string;
};

export type ClassifiedSmsMessage = MLSmsMessage & {
  mlResult: {
    label: "normal" | "promo" | "smish";
    cleanedText: string;
    dangerScore: number;
    confidence: number;
    probabilities: {
      normal: number;
      promo: number;
      smish: number;
    };
  };
};

export type SmsMessage = {
  id: string;
  body: string;
  date: number;
  read: boolean;
  sender: string;
};

export type SmsPredictionResult = {
  label: "normal" | "promo" | "smish";
  cleanedText: string;
  dangerScore: number;
  confidence: number;
  probabilities: {
    normal: number;
    promo: number;
    smish: number;
  };
};

export type FlaggedSmsMessage = ClassifiedSmsMessage & {
  finalRisk: FinalRiskResult;
};