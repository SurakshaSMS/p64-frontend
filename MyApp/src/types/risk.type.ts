export type RiskLevel = "safe" | "low" | "medium" | "high";

export type RiskFlag = {
  source: "sender_rule" | "content_rule" | "ai_model";
  level: RiskLevel;
  message: string;
};

export type FinalRiskResult = {
  riskLevel: RiskLevel;
  flags: RiskFlag[];
};