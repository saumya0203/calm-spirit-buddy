export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sentiment?: Sentiment;
  timestamp: Date;
}

export interface MoodEntry {
  id: string;
  emoji: string;
  label: string;
  journal?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😢', label: 'Down', value: 'down' },
] as const;
