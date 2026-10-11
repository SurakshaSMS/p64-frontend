export type SenderRule = {
  sender: string;
  normalizedSender: string;
  createdAt: number;
};

export type SenderStatus = "blocked" | "safe" | "unknown";