import { InterviewConfig, PersistedConfig } from '../types';

const KEY = 'ai_interview_config';
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export function saveConfig(config: InterviewConfig): void {
  const data: PersistedConfig = { config, savedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadConfig(): { config: InterviewConfig | null; expired: boolean } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { config: null, expired: false };

    const data: PersistedConfig = JSON.parse(raw);
    const age = Date.now() - data.savedAt;

    if (age > TTL_MS) {
      localStorage.removeItem(KEY);
      return { config: null, expired: true };
    }

    return { config: data.config, expired: false };
  } catch {
    return { config: null, expired: false };
  }
}

export function clearConfig(): void {
  localStorage.removeItem(KEY);
}
