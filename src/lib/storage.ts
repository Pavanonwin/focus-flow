// Local storage for BrainGain sessions and user data

export interface JournalReflection {
  did: string;
  distracted_by: string;
  takeaway: string;
}

export interface UserSession {
  id: string;
  focus_task: string;
  focus_why: string;
  duration_minutes: number;
  start_time: string;
  end_time?: string;
  distraction_apps: string[];
  focus_mode: 'light' | 'reminder';
  journal_during: string;
  journal_reflection?: JournalReflection;
  completed: boolean;
}

export interface OnboardingData {
  focus_task: string;
  focus_why: string;
  focus_duration_minutes: number;
  distraction_apps: string[];
  focus_mode: 'light' | 'reminder';
  allow_notifications: boolean;
}

const SESSIONS_KEY = 'braingain_sessions';
const ONBOARDING_KEY = 'braingain_onboarding';
const HAS_COMPLETED_ONBOARDING_KEY = 'braingain_has_onboarded';

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getSessions(): UserSession[] {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSession(session: UserSession): void {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getLastSession(): UserSession | null {
  const sessions = getSessions();
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

export function getCompletedSessionsThisWeek(): number {
  const sessions = getSessions();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return sessions.filter(s => {
    if (!s.completed || !s.end_time) return false;
    return new Date(s.end_time) >= oneWeekAgo;
  }).length;
}

export function getTotalCompletedSessions(): number {
  return getSessions().filter(s => s.completed).length;
}

export function saveOnboardingData(data: OnboardingData): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
}

export function getOnboardingData(): OnboardingData | null {
  const data = localStorage.getItem(ONBOARDING_KEY);
  return data ? JSON.parse(data) : null;
}

export function setHasCompletedOnboarding(value: boolean): void {
  localStorage.setItem(HAS_COMPLETED_ONBOARDING_KEY, JSON.stringify(value));
}

export function hasCompletedOnboarding(): boolean {
  const data = localStorage.getItem(HAS_COMPLETED_ONBOARDING_KEY);
  return data ? JSON.parse(data) : false;
}
