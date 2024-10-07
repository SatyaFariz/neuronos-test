export type Message = {
  id: string;
  incrementId: number;
  content: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
};

export type NotificationState = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
};

export type SoundType = 'notify';