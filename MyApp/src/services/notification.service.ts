import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { FlaggedSmsMessage } from "@/types/message.type";

const SMS_ALERT_CHANNEL = "sms-risk-alerts";

// Controls how notifications behave while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initializeNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      SMS_ALERT_CHANNEL,
      {
        name: "Scam SMS Alerts",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      }
    );
  }

  const currentPermission =
    await Notifications.getPermissionsAsync();

  if (!currentPermission.granted) {
    const permission =
      await Notifications.requestPermissionsAsync();

    return permission.granted;
  }

  return true;
}

export async function showSmsAlertNotification(
  message: FlaggedSmsMessage
) {
  const risk = message.finalRisk.riskLevel;

  const title =
    risk === "high"
      ? "⚠️ High Risk SMS Detected"
      : "⚠️ Suspicious SMS Detected";

  const body =
    message.body.length > 90
      ? `${message.body.substring(0, 90)}...`
      : message.body;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: `${message.sender}: ${body}`,

      sound: "default",

      data: {
        type: "sms-alert",
        messageId: message.id,
        sender: message.sender,
        riskLevel: risk,
      },
    },

    trigger:
      Platform.OS === "android"
        ? {
            channelId: SMS_ALERT_CHANNEL,
          }
        : null,
  });
}