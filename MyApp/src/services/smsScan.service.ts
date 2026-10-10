// src/services/smsScan.service.ts

import { getSmsMessages } from "@/services/smsReader.service";
import { classifySmsMessages } from "@/ml/classifySmsMessages";
import { useSmsStore } from "@/stores/useSmsStore";
import { FlaggedSmsMessage } from "@/types/message.type";
import { applySmsFlaggingRules } from "@/utils/smsFlagging.utils";

export async function scanAndStoreSmsMessages(limit: number) {
  const smsStore = useSmsStore.getState();

  // get set of messages from sms reader
  const smsMessages = await getSmsMessages(limit);
  smsStore.setRawMessages(smsMessages);

  // get classified messages
  const classifiedMessages = await classifySmsMessages(smsMessages);
  const flaggedMessages: FlaggedSmsMessage[] = classifiedMessages.map((message) => ({
    ...message,
    finalRisk: applySmsFlaggingRules(message),
  }))
  
  
  smsStore.setFlaggedMessages(flaggedMessages);

  return {
    flaggedMessages
  };
}
