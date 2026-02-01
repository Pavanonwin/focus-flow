// Analytics events for BrainGain
// These are custom events that can be connected to any analytics provider

type AnalyticsEvent =
  | 'app_opened'
  | 'onboarding_completed'
  | 'focus_started'
  | 'focus_completed'
  | 'focus_abandoned'
  | 'emergency_exit_used'
  | 'journal_saved'
  | 'second_session_started';

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, data?: EventData): void {
  // Log to console for development/debugging
  console.log(`[Analytics] ${event}`, data || {});
  
  // Store event locally for future analytics integration
  const events = JSON.parse(localStorage.getItem('braingain_events') || '[]');
  events.push({
    event,
    data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('braingain_events', JSON.stringify(events));
}
