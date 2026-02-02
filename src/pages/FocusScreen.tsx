import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { useTimer } from '@/hooks/useTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Pause,
  Play
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JOURNAL_PROMPTS = {
  initial: "What are you working on right now?",
  midSession: "Any distractions so far?"
};

export default function FocusScreen() {
  const navigate = useNavigate();
  const { currentSession, updateSessionJournal, emergencyExit } = useApp();
  const [journalText, setJournalText] = useState(currentSession?.journal_during || '');
  const [showWhyExpanded, setShowWhyExpanded] = useState(true); // Start expanded
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS.initial);
  const [whyIsHighlighted, setWhyIsHighlighted] = useState(true); // For initial glow effect
  const { sendNotification, requestPermission, permission } = useNotifications();

  const handleComplete = useCallback(() => {
    navigate('/complete');
  }, [navigate]);

  const { 
    timeRemaining, 
    percentComplete, 
    isRunning,
    isPaused,
    pause,
    resume,
    start,
    formatTime 
  } = useTimer(currentSession?.duration_minutes || 25, handleComplete);

  // Start timer and request notifications on mount
  useEffect(() => {
    start();
    if (permission === 'default') {
      requestPermission();
    }
    
    // Remove highlight glow after 5 seconds, but keep expanded
    const timer = setTimeout(() => {
      setWhyIsHighlighted(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [start, permission, requestPermission]);

  // Update journal prompt at 50%
  useEffect(() => {
    if (percentComplete >= 50 && currentPrompt === JOURNAL_PROMPTS.initial) {
      setCurrentPrompt(JOURNAL_PROMPTS.midSession);
    }
  }, [percentComplete, currentPrompt]);

  // Save journal periodically
  useEffect(() => {
    const timer = setTimeout(() => {
      if (journalText !== currentSession?.journal_during) {
        updateSessionJournal(journalText);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [journalText, currentSession?.journal_during, updateSessionJournal]);

  // Handle visibility change for reminders
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && !isPaused && currentSession) {
        sendNotification(
          `You chose to focus on "${currentSession.focus_task}"`,
          { body: "Want to continue?" }
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isPaused, currentSession, sendNotification]);

  const handleEmergencyExit = () => {
    emergencyExit();
    navigate('/');
  };

  if (!currentSession) {
    navigate('/');
    return null;
  }

  // Timer ring calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentComplete / 100);

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Timer Section */}
      <div className="flex-shrink-0 flex flex-col items-center mb-6">
        {/* Timer Ring */}
        <div className="relative w-72 h-72 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            {/* Progress ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Timer text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-foreground tabular-nums">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              remaining
            </span>
            
            {/* Pause/Play button */}
            <button
              onClick={isPaused ? resume : pause}
              className="mt-4 p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-foreground" />
              ) : (
                <Pause className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          {currentSession.focus_task}
        </h1>

        {/* Highlighted "Why it matters" - Always visible initially */}
        <div 
          className={cn(
            "mt-4 p-4 rounded-xl border-2 transition-all duration-500",
            whyIsHighlighted
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 animate-pulse-glow"
              : "border-border bg-card"
          )}
        >
          <button 
            onClick={() => setShowWhyExpanded(!showWhyExpanded)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className={cn(
              "text-sm font-medium transition-colors",
              whyIsHighlighted || showWhyExpanded ? "text-primary" : "text-muted-foreground"
            )}>
              💡 Why this matters to you
            </span>
            {showWhyExpanded ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {showWhyExpanded && (
            <p className="text-foreground mt-2 font-medium animate-fade-in">
              "{currentSession.focus_why}"
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Journal Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-muted-foreground mb-2">
          {currentPrompt}
        </label>
        <Textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Write your thoughts..."
          className="flex-1 min-h-[120px] rounded-xl resize-none text-base"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Emergency Exit */}
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "w-full h-14 rounded-xl border-2 border-destructive/50",
          "text-destructive hover:bg-destructive/10 hover:border-destructive"
        )}
        onClick={() => setShowExitDialog(true)}
      >
        <AlertTriangle className="w-5 h-5 mr-2" />
        Emergency Exit
      </Button>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit focus session immediately?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved, but the session will be marked as incomplete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEmergencyExit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Exit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
