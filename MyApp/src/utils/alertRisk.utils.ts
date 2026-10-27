
import { AlertItem } from "@/types/alert.type";
export const getRiskColor = (score: number) => {
  if (score >= 80) {
    return "#FF315E";
  }

  if (score >= 60) {
    return "#FFB800";
  }

  if (score >= 50) {
    return "#8D45FF";
  }

  return "#7B7CFF";
};

export const getIconDetails = (alert: AlertItem) => {
  if (alert.score >= 80) {
    return {
      icon: "warning-outline" as const,
      color: "#FF315E",
      background: "#501129",
    };
  }

  if (alert.score >= 60) {
    return {
      icon: "warning-outline" as const,
      color: "#FFB800",
      background: "#063E28",
    };
  }

  return {
    icon: "chatbubble-outline" as const,
    color: "#8D8DFF",
    background: "#101A51",
  };
};

export const getRiskCategory = (score: number) => {
  if (score >= 80) {
    return "High Risk";
  }

  if (score >= 60) {
    return "Medium Risk";
  }

  return "Low Risk";
};

export default { getRiskColor, getIconDetails };