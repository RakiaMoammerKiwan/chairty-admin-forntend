// src/types/Feedback.ts

export type FeedbackStatus = 'معلق' | 'مقبول' | 'مرفوض';

export interface Feedback {
  id: number;
  user_name: string;
  message: string;
  status: FeedbackStatus;
  created_at: string;
}