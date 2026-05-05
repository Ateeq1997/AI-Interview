// ─── Interview Configuration Types ───────────────────────────────────────────

export type InterviewType = 'Technical' | 'Behavioral' | 'System Design' | 'Mixed';
export type Difficulty = 'Junior' | 'Mid' | 'Senior' | 'Lead';
export type Duration = 15 | 30 | 45 | 60;
export type AddOn = 'AI Follow-up Questions' | 'Detailed Performance Report' | 'Video Recording' | 'Expert Review';

export interface DurationOption {
  minutes: Duration;
  basePrice: number;
  label: string;
}

export interface AddOnOption {
  id: AddOn;
  price: number;
  label: string;
}

export interface InterviewConfig {
  interviewType: InterviewType | null;
  difficulty: Difficulty | null;
  topics: string[];
  duration: Duration;
  addOns: AddOn[];
}

export interface PersistedConfig {
  config: InterviewConfig;
  savedAt: number;
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export const DURATION_OPTIONS: DurationOption[] = [
  { minutes: 15, basePrice: 10, label: '15 minutes' },
  { minutes: 30, basePrice: 20, label: '30 minutes' },
  { minutes: 45, basePrice: 35, label: '45 minutes' },
  { minutes: 60, basePrice: 50, label: '60 minutes' },
];

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  Junior: 1.0,
  Mid: 1.2,
  Senior: 1.5,
  Lead: 1.8,
};

export const ADD_ON_OPTIONS: AddOnOption[] = [
  { id: 'AI Follow-up Questions', price: 5, label: 'AI Follow-up Questions' },
  { id: 'Detailed Performance Report', price: 10, label: 'Detailed Performance Report' },
  { id: 'Video Recording', price: 8, label: 'Video Recording' },
  { id: 'Expert Review', price: 25, label: 'Expert Review' },
];

export const INTERVIEW_TYPES: InterviewType[] = ['Technical', 'Behavioral', 'System Design', 'Mixed'];
export const DIFFICULTIES: Difficulty[] = ['Junior', 'Mid', 'Senior', 'Lead'];

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export interface CouponResult {
  valid: boolean;
  discount: number;
  message?: string;
  error?: string;
}

// ─── Question Bank Types ──────────────────────────────────────────────────────

export interface Question {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  score: number;
  date: string;
  tags: string[];
}

export interface QuestionFilters {
  difficulty: string;
  topic: string;
}
