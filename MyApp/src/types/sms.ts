export type MLSmsMessage = {
  id: string;
  body: string;
  date: number;
  read: boolean;
  sender: string;
};

export type ClassifiedSmsMessage = MLSmsMessage & {
  mlResult: {
    label: 'normal' | 'promo' | 'smish';
    cleanedText: string;
    dangerScore: number;
    confidence: number;
    probabilities: {
      normal: number;
      promo: number;
      smish: number;
    };
  };
};