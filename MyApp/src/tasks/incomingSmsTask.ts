import { classifySmsMessage } from "@/ml/classifySmsMessages";
import { useAlertStore } from "@/stores/useAlertStore";
import { useSmsStore } from "@/stores/useSmsStore";
import { FlaggedSmsMessage, SmsMessage } from "@/types/message.type";
import { transformSmsToAlertItem } from "@/transformers/alertItem.transformer";
import { applySmsFlaggingRules } from "@/utils/smsFlagging.utils";
import { shouldPushToAlerts } from "@/utils/pushAlerts.utils";
import { showSmsAlertNotification } from "@/services/notification.service";
type IncomingSmsTaskData = {
  id?: string;
  sender?: string;
  body?: string;
  date?: number;
  read?: boolean;
};

function normalizeIncomingSms(data: IncomingSmsTaskData): SmsMessage | null {
  if (!data.body || data.body.trim().length === 0) {
    return null;
  }

  return {
    id: data.id ?? `incoming-${Date.now()}`,
    sender: data.sender ?? "Unknown",
    body: data.body,
    date: Number(data.date ?? Date.now()),
    read: Boolean(data.read),
  };
}

export async function incomingSmsTask(data: IncomingSmsTaskData) {
  try {
    const smsMessage = normalizeIncomingSms(data);

    if (!smsMessage) {
      return;
    }

    const smsStore = useSmsStore.getState();
    const alertStore = useAlertStore.getState();

    smsStore.appendRawMessages([smsMessage]);

    const classifiedMessage = await classifySmsMessage(smsMessage);

    const flaggedMessage: FlaggedSmsMessage = {
      ...classifiedMessage,
      finalRisk: applySmsFlaggingRules(classifiedMessage),
    };

    smsStore.appendFlaggedMessages([flaggedMessage]);

    const shouldAlert = shouldPushToAlerts(flaggedMessage.sender, flaggedMessage.finalRisk.riskLevel);

    if (shouldAlert) {
      const alertItem = transformSmsToAlertItem(flaggedMessage);
      alertStore.appendAlertItems([alertItem]);
      await showSmsAlertNotification(flaggedMessage);
    }

    console.log("Background SMS scanned:", flaggedMessage);
  } catch (error) {
    console.error("Background SMS scan failed:", error);
  }
}