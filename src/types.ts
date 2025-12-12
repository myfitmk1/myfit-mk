
export type View = 'planner' | 'exercises' | 'calendar' | 'stats' | 'gallery' | 'settings' | 'ai-trainer';

export type ExerciseLevel = 'Почетник' | 'Среден' | 'Напреден';

export interface Exercise {
  id: string;
  name: string;
  englishName: string;
  description: string;
  category: string;
  level: ExerciseLevel;
  sets: number;
  reps: string;
  explanation: string;
  rating: number;
  difficulty: string;
  time: string;
  muscles: string;
  note?: string;
  animation?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string; // ISO Date String
  exercises: Exercise[];
  completed: boolean;
}

export interface UserProfile {
  name: string;
  level: ExerciseLevel;
  joinedDate: string;
}

export interface AppSettings {
  darkMode: boolean;
  soundNotifications: boolean;
  workoutReminders: boolean;
}

export interface GalleryImage {
  id: string;
  url: string; // Base64 string
  date: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface LicenseData {
  status: 'active' | 'expired' | 'invalid';
  expiryDate: string | null;
  deviceId: string;
}

export interface AppData {
  userProfile: UserProfile;
  savedRoutines: Routine[];
  favorites: string[]; // Exercise IDs
  scheduledWorkouts: Record<string, WorkoutSession[]>; // Date -> Sessions
  workoutHistory: WorkoutSession[];
  galleryImages: GalleryImage[];
  settings: AppSettings;
  license?: string; // Encrypted license string
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface StatItem {
  name: string;
  value: number;
}
