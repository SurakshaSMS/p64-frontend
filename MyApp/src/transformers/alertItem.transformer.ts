import { AlertItem } from "@/types/alert.type";
import { ClassifiedSmsMessage } from "@/types/message.type";

function formatSmsTime(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSmsDate(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function transformSmsToAlertItem(
  message: ClassifiedSmsMessage
): AlertItem {
  return {
    id: message.id,
    sender: message.sender,
    source: "SMS",
    time: formatSmsTime(message.date),
    date: formatSmsDate(message.date),
    timestamp: message.date,
    score: message.mlResult.dangerScore,
    unread: !message.read,
  };
}

export function transformSmsToAlertItems(
  messages: ClassifiedSmsMessage[]
): AlertItem[] {
  return messages.map(transformSmsToAlertItem);
}