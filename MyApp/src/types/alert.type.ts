// src/types/alert.type.ts

export type AlertItem = {
  id: string;
  sender: string;
  source: string;
  time: string;
  date: string;
  timestamp: number;
  score: number;
  unread?: boolean;
  dismissed?: boolean;
};