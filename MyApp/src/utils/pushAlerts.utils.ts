
import { useSenderTrustStore } from "../stores/useSenderTrustStore";
import { useUserSettingsStore } from "../stores/useSettingStore";

let ALERT_RISK_LEVELS = ["medium", "high"];

function getAlertRiskLevels() {
  const scanSensitivity =
    useUserSettingsStore.getState().scanSensitivity;

  if (scanSensitivity === "Low") {
    return ["high"];
  }

  if (scanSensitivity === "Balanced") {
    return ["medium", "high"];
  }

  return ["low", "medium", "high"];
}

export function shouldPushToAlerts(sender: string, riskLevel: string): boolean {
  const senderTrustStore = useSenderTrustStore.getState();

  const senderStatus = senderTrustStore.getSenderStatus(sender);

  // User explicitly marked sender as SAFE
  if (senderStatus === "safe") {
    console.log("[IncomingSMS] Sender marked safe. Skipping alert:", sender);

    return false;
  }

  // User explicitly marked sender as SCAM
  if (senderStatus === "blocked") {
    console.log("[IncomingSMS] Sender marked scam. Forcing alert:", sender);

    return true;
  }

  const alertRiskLevels = getAlertRiskLevels();
  // Otherwise fall back to calculated risk
  return alertRiskLevels.includes(riskLevel);
}
