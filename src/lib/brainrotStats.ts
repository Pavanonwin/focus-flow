// Personalized brainrot statistics based on selected distraction apps

export interface BrainrotStat {
  app: string;
  dailyUsage: string;
  weeklyHours: number;
  globalUsers: string;
  mentalHealthImpact: string;
  attentionSpanEffect: string;
}

export const APP_STATS: Record<string, BrainrotStat> = {
  'Instagram': {
    app: 'Instagram',
    dailyUsage: '53 minutes',
    weeklyHours: 6.2,
    globalUsers: '2+ billion',
    mentalHealthImpact: 'Linked to increased anxiety and depression in teens',
    attentionSpanEffect: 'Reduces sustained attention by 25%'
  },
  'TikTok': {
    app: 'TikTok',
    dailyUsage: '95 minutes',
    weeklyHours: 11.1,
    globalUsers: '1.5+ billion',
    mentalHealthImpact: 'Associated with dopamine dysregulation and ADHD-like symptoms',
    attentionSpanEffect: 'Shortens attention span to under 8 seconds'
  },
  'YouTube': {
    app: 'YouTube',
    dailyUsage: '74 minutes',
    weeklyHours: 8.6,
    globalUsers: '2.5+ billion',
    mentalHealthImpact: 'Endless autoplay increases procrastination by 40%',
    attentionSpanEffect: 'Creates "rabbit hole" browsing patterns'
  },
  'Twitter / X': {
    app: 'Twitter / X',
    dailyUsage: '34 minutes',
    weeklyHours: 4.0,
    globalUsers: '600+ million',
    mentalHealthImpact: 'Increases stress and negative emotions from doom-scrolling',
    attentionSpanEffect: 'Fragments thinking into 280-character bursts'
  },
  'Browser': {
    app: 'Browser',
    dailyUsage: '47 minutes',
    weeklyHours: 5.5,
    globalUsers: 'Universal',
    mentalHealthImpact: 'Tab overload increases cognitive fatigue',
    attentionSpanEffect: 'Multi-tab browsing reduces focus by 30%'
  }
};

export const MOTIVATIONAL_QUOTES = [
  "Your attention is your superpower. Reclaim it.",
  "Every minute you choose focus is a vote for your future self.",
  "The cost of distraction is measured in dreams delayed.",
  "You're not avoiding apps — you're choosing yourself.",
  "Breaking free from the scroll is an act of self-respect.",
  "Your brain wasn't designed for infinite content. Give it peace.",
  "Focus is the new wealth. Start investing today.",
  "One hour of deep work beats 4 hours of distracted effort.",
];

export function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function getStatsForApps(apps: string[]): BrainrotStat[] {
  return apps
    .map(app => APP_STATS[app])
    .filter((stat): stat is BrainrotStat => stat !== undefined);
}

export function calculateTotalWeeklyHours(apps: string[]): number {
  return apps.reduce((total, app) => {
    const stat = APP_STATS[app];
    return total + (stat?.weeklyHours || 0);
  }, 0);
}

export function getImpactLevel(hours: number): 'low' | 'medium' | 'high' | 'critical' {
  if (hours < 5) return 'low';
  if (hours < 15) return 'medium';
  if (hours < 25) return 'high';
  return 'critical';
}

export function getImpactMessage(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'low':
      return "You're doing well! Small improvements can still help.";
    case 'medium':
      return "Moderate risk. Focus sessions will significantly boost your productivity.";
    case 'high':
      return "High impact zone. Reclaiming this time could transform your week.";
    case 'critical':
      return "Critical attention debt. Your brain is begging for focused time.";
  }
}
