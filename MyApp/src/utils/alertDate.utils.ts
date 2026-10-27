import { AlertItem } from "@/types/alert.type";

function isSameDay(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const today = new Date();

  return isSameDay(date, today);
}

export function isYesterday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(date, yesterday);
}

export function sortAlertsByRecent(alerts: AlertItem[]): AlertItem[] {
  return [...alerts].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
}

export function groupAlertsByDate(alerts: AlertItem[]) {
  const sortedAlerts = sortAlertsByRecent(alerts);

  const todayAlerts = sortedAlerts.filter((alert) => {
    return isToday(alert.timestamp);
  });

  const yesterdayAlerts = sortedAlerts.filter((alert) => {
    return isYesterday(alert.timestamp);
  });

  const pastAlerts = sortedAlerts.filter((alert) => {
    return !isToday(alert.timestamp) && !isYesterday(alert.timestamp);
  });

  return {
    todayAlerts,
    yesterdayAlerts,
    pastAlerts,
  };
}