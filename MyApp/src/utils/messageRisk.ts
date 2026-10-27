import { ClassifiedSmsMessage } from '@/types/sms';
import { RiskLevel } from '@/types/risk.type';



export const getRiskColor = (risk: RiskLevel) => {
  if (risk === 'high') {
    return '#FF4D5E';
  }

  if (risk === 'medium') {
    return '#FFB800';
  }

  return '#13D67A';
};

export const getRiskBackground = (risk: RiskLevel) => {
  if (risk === 'high') {
    return '#3B1624';
  }

  if (risk === 'medium') {
    return '#493900';
  }

  return '#0C3125';
};

export const formatMessageTime = (date: number) => {
  const now = Date.now();
  const difference = Math.max(0, now - date);

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (days === 1) {
    return 'Yesterday';
  }

  return `${days} days ago`;
};