import { predictSms } from "./smishingModel";
import { ClassifiedSmsMessage, MLSmsMessage } from "../types/message.type";

export async function classifySmsMessage(
  sms: MLSmsMessage,
): Promise<ClassifiedSmsMessage> {
  const prediction = await predictSms(sms.body);

  return {
    ...sms,
    mlResult: prediction,
  };
}

export async function classifySmsMessages(
  messages: MLSmsMessage[],
): Promise<ClassifiedSmsMessage[]> {
  const classifiedMessages: ClassifiedSmsMessage[] = [];

  for (const sms of messages) {
    const classifiedSms = await classifySmsMessage(sms);
    classifiedMessages.push(classifiedSms);
  }

  return classifiedMessages;
}
