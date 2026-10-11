import { useSenderTrustStore } from '../stores/useSenderTrustStore';
const ALERT_RISK_LEVELS = ['medium', 'high'];

export function shouldPushToAlerts(
  sender: string,
  riskLevel: string
): boolean {
  const senderTrustStore =
    useSenderTrustStore.getState();

  const senderStatus =
    senderTrustStore.getSenderStatus(sender);

  // User explicitly marked sender as SAFE
  if (senderStatus === 'safe') {
    console.log(
      '[IncomingSMS] Sender marked safe. Skipping alert:',
      sender
    );

    return false;
  }

  // User explicitly marked sender as SCAM
  if (senderStatus === 'blocked') {
    console.log(
      '[IncomingSMS] Sender marked scam. Forcing alert:',
      sender
    );

    return true;
  }

  // Otherwise fall back to calculated risk
  return ALERT_RISK_LEVELS.includes(riskLevel);
}