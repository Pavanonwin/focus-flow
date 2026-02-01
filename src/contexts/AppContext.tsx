import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  OnboardingData, 
  UserSession, 
  hasCompletedOnboarding, 
  setHasCompletedOnboarding,
  getOnboardingData,
  saveOnboardingData,
  saveSession,
  getLastSession,
  generateSessionId,
  getTotalCompletedSessions
} from '@/lib/storage';
import { trackEvent } from '@/lib/analytics';

interface AppContextType {
  // App state
  isFirstTime: boolean;
  currentSession: UserSession | null;
  
  // Onboarding
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  
  // Session management
  startSession: () => void;
  updateSessionJournal: (journal: string) => void;
  completeSession: (reflection: UserSession['journal_reflection']) => void;
  abandonSession: () => void;
  emergencyExit: () => void;
  
  // Navigation helpers
  resetForNewSession: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isFirstTime, setIsFirstTime] = useState(!hasCompletedOnboarding());
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(() => {
    return getOnboardingData() || {};
  });
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);

  useEffect(() => {
    trackEvent('app_opened');
  }, []);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    const fullData = onboardingData as OnboardingData;
    saveOnboardingData(fullData);
    setHasCompletedOnboarding(true);
    setIsFirstTime(false);
    trackEvent('onboarding_completed');
  };

  const startSession = () => {
    const totalSessions = getTotalCompletedSessions();
    
    const session: UserSession = {
      id: generateSessionId(),
      focus_task: onboardingData.focus_task || '',
      focus_why: onboardingData.focus_why || '',
      duration_minutes: onboardingData.focus_duration_minutes || 25,
      start_time: new Date().toISOString(),
      distraction_apps: onboardingData.distraction_apps || [],
      focus_mode: onboardingData.focus_mode || 'light',
      journal_during: '',
      completed: false,
    };
    
    setCurrentSession(session);
    saveSession(session);
    
    if (totalSessions > 0) {
      trackEvent('second_session_started');
    }
    trackEvent('focus_started', { duration: session.duration_minutes });
  };

  const updateSessionJournal = (journal: string) => {
    if (!currentSession) return;
    
    const updated = { ...currentSession, journal_during: journal };
    setCurrentSession(updated);
    saveSession(updated);
  };

  const completeSession = (reflection: UserSession['journal_reflection']) => {
    if (!currentSession) return;
    
    const completed: UserSession = {
      ...currentSession,
      end_time: new Date().toISOString(),
      journal_reflection: reflection,
      completed: true,
    };
    
    setCurrentSession(completed);
    saveSession(completed);
    trackEvent('focus_completed', { duration: currentSession.duration_minutes });
    trackEvent('journal_saved');
  };

  const abandonSession = () => {
    if (!currentSession) return;
    
    const abandoned: UserSession = {
      ...currentSession,
      end_time: new Date().toISOString(),
      completed: false,
    };
    
    saveSession(abandoned);
    setCurrentSession(null);
    trackEvent('focus_abandoned');
  };

  const emergencyExit = () => {
    trackEvent('emergency_exit_used');
    abandonSession();
  };

  const resetForNewSession = () => {
    setCurrentSession(null);
  };

  return (
    <AppContext.Provider value={{
      isFirstTime,
      currentSession,
      onboardingData,
      updateOnboardingData,
      completeOnboarding,
      startSession,
      updateSessionJournal,
      completeSession,
      abandonSession,
      emergencyExit,
      resetForNewSession,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
