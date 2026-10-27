import { ClassifiedSmsMessage, FlaggedSmsMessage } from "@/types/message.type";
import { applySmsFlaggingRules } from "@/utils/smsFlagging.utils";

export function applyFlaggingToMessages(
  messages: ClassifiedSmsMessage[]
): FlaggedSmsMessage[] {
  return messages.map((message) => ({
    ...message,
    finalRisk: applySmsFlaggingRules(message),
  }));
}