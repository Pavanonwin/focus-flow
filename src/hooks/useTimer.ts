import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
  percentComplete: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  formatTime: (seconds: number) => string;
}

export function useTimer(durationMinutes: number, onComplete?: () => void): UseTimerReturn {
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeRemaining]);

  const start = useCallback(() => {
    setTimeRemaining(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
  }, [totalSeconds]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
  }, [totalSeconds]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const percentComplete = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  return {
    timeRemaining,
    totalTime: totalSeconds,
    isRunning,
    isPaused,
    percentComplete,
    start,
    pause,
    resume,
    reset,
    formatTime,
  };
}
