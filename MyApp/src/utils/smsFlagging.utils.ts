import { useSenderTrustStore } from "@/stores/useSenderTrustStore";
import { ClassifiedSmsMessage } from "@/types/message.type";
import { FinalRiskResult, RiskFlag, RiskLevel } from "@/types/risk.type";

function hasUrl(text: string): boolean {
  return /https?:\/\/\S+|www\.\S+|[a-zA-Z0-9-]+\.(com|net|org|id|co|me|xyz|ly)\S*/i.test(
    text
  );
}

function getHighestRisk(flags: RiskFlag[]): RiskLevel {
  if (flags.some((flag) => flag.level === "high")) {
    return "high";
  }

  if (flags.some((flag) => flag.level === "medium")) {
    return "medium";
  }

  if (flags.some((flag) => flag.level === "low")) {
    return "low";
  }

  return "safe";
}

export function applySmsFlaggingRules(
  message: ClassifiedSmsMessage
): FinalRiskResult {
  const flags: RiskFlag[] = [];

  const senderStatus = useSenderTrustStore
    .getState()
    .getSenderStatus(message.sender);

  /**
   * Priority 1:
   * Blocked sender always becomes high risk.
   */
  if (senderStatus === "blocked") {
    return {
      riskLevel: "high",
      flags: [
        {
          source: "sender_rule",
          level: "high",
          message: "Sender is in your blocked sender list.",
        },
      ],
    };
  }

  /**
   * Priority 2:
   * Safe sender is automatically treated as safe.
   */
  if (senderStatus === "safe") {
    return {
      riskLevel: "safe",
      flags: [
        {
          source: "sender_rule",
          level: "safe",
          message: "Sender is in your safe sender list.",
        },
      ],
    };
  }

  /**
   * Priority 3:
   * AI model result.
   */
  if (message.mlResult.label === "smish") {
    flags.push({
      source: "ai_model",
      level: "high",
      message: "AI model classified this message as smishing.",
    });
  } else if (message.mlResult.label === "promo") {
    flags.push({
      source: "ai_model",
      level: "low",
      message: "AI model classified this message as promotional.",
    });
  }

  /**
   * Priority 4:
   * Content rules.
   */
  if (hasUrl(message.body) || hasUrl(message.mlResult.cleanedText)) {
    flags.push({
      source: "content_rule",
      level: "medium",
      message: "Message contains a URL or website link.",
    });
  }

  /**
   * Fallback:
   * No suspicious rule matched.
   */
  if (flags.length === 0) {
    return {
      riskLevel: "low",
      flags: [
        {
          source: "ai_model",
          level: "low",
          message: "No blocked sender or suspicious link was detected.",
        },
      ],
    };
  }

  return {
    riskLevel: getHighestRisk(flags),
    flags,
  };
}