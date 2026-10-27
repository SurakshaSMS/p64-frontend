export type AlertItem = {
  id: string;
  sender: string;
  source: string;
  time: string;
  date: string;
  timestamp: number;
  score: number;
  unread?: boolean;
};