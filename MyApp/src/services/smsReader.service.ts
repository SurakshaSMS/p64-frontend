// services/smsService.ts

import {
  PermissionsAndroid,
  Platform,
} from 'react-native';

import SmsReader, {
  SmsMessage,
} from '../../modules/sms-reader/src/SmsReaderModule';

import {
  MLSmsMessage,
} from '@/types/message.type';
export async function requestSmsPermission() {
  if (Platform.OS !== "android") {
    return false;
  }

  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  ]);

  console.log("SMS permission details:", result);

  const readSmsGranted =
    result[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
    PermissionsAndroid.RESULTS.GRANTED;

  const receiveSmsGranted =
    result[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
    PermissionsAndroid.RESULTS.GRANTED;

  console.log("READ_SMS granted:", readSmsGranted);
  console.log("RECEIVE_SMS granted:", receiveSmsGranted);

  return readSmsGranted && receiveSmsGranted;
}
export async function getSmsMessages(limit: number): Promise<MLSmsMessage[]> {
  const messages: SmsMessage[] = await SmsReader.getMessages(limit);

  const validMessages: MLSmsMessage[] = messages
    .filter((message) => {
      return (
        typeof message.body === "string" &&
        message.body.trim().length > 0
      );
    })
    .map((message) => ({
      id: String(message.id),
      body: message.body as string,
      date: Number(message.date),
      read: Boolean(message.read),
      sender: message.sender ?? "Unknown",
    }));

  return validMessages;
}