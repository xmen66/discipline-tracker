export interface Habit {
  id: string;
  name: string;
  category: 'Physical' | 'Focus' | 'Social' | 'Financial' | 'Social/Financial';
  completed: boolean;
  streak: number;
}

export interface AuthData {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  title?: string;
  badge?: string;
  level?: number;
  xp?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Ace' | 'Master';
}

export interface FeedEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'achievement' | 'streak' | 'stat_update' | 'habit_completed';
  content: string;
  timestamp: string;
}

export interface NotificationSettings {
  enabled: boolean;
  morningTime: string; // "08:00"
  eveningTime: string; // "20:00"
  reminderInterval: number; // in minutes
}

export interface CriticalTask {
  id: string;
  text: string;
  completed: boolean;
}

export type Theme = 'dark' | 'light';

export interface UserState {
  auth?: AuthData;
  identity: string[];
  habits: Habit[];
  criticalPath: CriticalTask[];
  waterIntake: number; // in ml
  steps: number;
  calories: number;
  weight: number;
  targetWeight: number;
  height?: number; // in cm
  age?: number;
  gender?: 'male' | 'female';
  sleepHours: number;
  sleepQuality: number; // 0-100
  focusSessions: number;
  streak: number;
  lastActive: string; // date string
  isPro: boolean;
  score: number;
  level: number;
  xp: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Ace' | 'Master';
  theme: Theme;
  accentColor: string;
  dailyHistory: Record<string, DailyHistoryEntry>;
  notificationSettings: NotificationSettings;
  customWaterGoal?: number;
}

export interface DailyHistoryEntry {
  score: number;
  completedHabits: string[];
  waterIntake: number;
  steps: number;
  calories: number;
  weight: number;
  promise: string;
}

export type IdentityRank = 'The Drifter' | 'The Seeker' | 'The Warrior' | 'The Elite' | 'The Stoic Master';
