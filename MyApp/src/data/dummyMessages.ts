import { ClassifiedSmsMessage } from '@/types/sms';

const now = Date.now();

export const dummyMessages: ClassifiedSmsMessage[] = [
  {
    id: '1',
    sender: 'bKash Alert',
    body:
      'URGENT: Your account has been locked. Click here immediately to verify your identity or lose access.',
    date: now - 2 * 60 * 1000,
    read: false,

    mlResult: {
      label: 'smish',
      cleanedText:
        'urgent your account has been locked click here immediately to verify your identity or lose access',
      dangerScore: 92,
      confidence: 0.96,

      probabilities: {
        normal: 0.02,
        promo: 0.02,
        smish: 0.96,
      },
    },
  },

  {
    id: '2',
    sender: 'Unknown Number',
    body:
      'You have won a prize! Claim it before it expires. Tap the link to continue.',
    date: now - 10 * 60 * 1000,
    read: false,

    mlResult: {
      label: 'promo',
      cleanedText:
        'you have won a prize claim it before it expires tap the link to continue',
      dangerScore: 65,
      confidence: 0.78,

      probabilities: {
        normal: 0.08,
        promo: 0.78,
        smish: 0.14,
      },
    },
  },

  {
    id: '3',
    sender: 'John',
    body: 'Hey, are we still meeting at 5 PM?',
    date: now - 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'normal',
      cleanedText: 'hey are we still meeting at 5 pm',
      dangerScore: 10,
      confidence: 0.95,

      probabilities: {
        normal: 0.95,
        promo: 0.03,
        smish: 0.02,
      },
    },
  },

  {
    id: '4',
    sender: 'Bank Security',
    body:
      'Unusual activity detected. Verify your account immediately to prevent suspension.',
    date: now - 2 * 60 * 60 * 1000,
    read: false,

    mlResult: {
      label: 'smish',
      cleanedText:
        'unusual activity detected verify your account immediately to prevent suspension',
      dangerScore: 88,
      confidence: 0.93,

      probabilities: {
        normal: 0.03,
        promo: 0.04,
        smish: 0.93,
      },
    },
  },

  {
    id: '5',
    sender: 'Delivery Service',
    body:
      'Your package is waiting. Confirm your delivery information to arrange delivery.',
    date: now - 3 * 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'promo',
      cleanedText:
        'your package is waiting confirm your delivery information to arrange delivery',
      dangerScore: 58,
      confidence: 0.72,

      probabilities: {
        normal: 0.16,
        promo: 0.72,
        smish: 0.12,
      },
    },
  },

  {
    id: '6',
    sender: 'Mum',
    body: 'Call me when you get home.',
    date: now - 4 * 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'normal',
      cleanedText: 'call me when you get home',
      dangerScore: 5,
      confidence: 0.98,

      probabilities: {
        normal: 0.98,
        promo: 0.01,
        smish: 0.01,
      },
    },
  },

  {
    id: '7',
    sender: 'Prize Winner',
    body:
      'Congratulations! You have been selected to receive a cash reward. Claim now.',
    date: now - 24 * 60 * 60 * 1000,
    read: false,

    mlResult: {
      label: 'smish',
      cleanedText:
        'congratulations you have been selected to receive a cash reward claim now',
      dangerScore: 95,
      confidence: 0.97,

      probabilities: {
        normal: 0.01,
        promo: 0.02,
        smish: 0.97,
      },
    },
  },

  {
    id: '8',
    sender: 'Unknown Sender',
    body:
      'Special offer available today only. Tap here to learn more.',
    date: now - 25 * 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'promo',
      cleanedText:
        'special offer available today only tap here to learn more',
      dangerScore: 52,
      confidence: 0.81,

      probabilities: {
        normal: 0.10,
        promo: 0.81,
        smish: 0.09,
      },
    },
  },

  {
    id: '9',
    sender: 'Sarah',
    body: 'Are you coming to class tomorrow?',
    date: now - 27 * 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'normal',
      cleanedText: 'are you coming to class tomorrow',
      dangerScore: 8,
      confidence: 0.96,

      probabilities: {
        normal: 0.96,
        promo: 0.03,
        smish: 0.01,
      },
    },
  },

  {
    id: '10',
    sender: 'University',
    body:
      'Reminder: Your class begins at 9:30 AM tomorrow.',
    date: now - 48 * 60 * 60 * 1000,
    read: true,

    mlResult: {
      label: 'normal',
      cleanedText:
        'reminder your class begins at 9 30 am tomorrow',
      dangerScore: 3,
      confidence: 0.99,

      probabilities: {
        normal: 0.99,
        promo: 0.005,
        smish: 0.005,
      },
    },
  },
];

export const getMessageById = (id: string) => {
  return dummyMessages.find((message) => message.id === id);
};