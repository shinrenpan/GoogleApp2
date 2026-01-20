import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export const useTimer = () => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusDuration);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  
  // Use a ref for the timer interval to clear it properly
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    let duration = settings.focusDuration;
    if (mode === TimerMode.SHORT_BREAK) duration = settings.shortBreakDuration;
    if (mode === TimerMode.LONG_BREAK) duration = settings.longBreakDuration;
    
    setTimeLeft(duration);
    setIsActive(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [mode, settings]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    // Timer will be reset by the useEffect listening to 'mode'
  }, []);

  // Update timeLeft when mode or settings change
  useEffect(() => {
    let duration = settings.focusDuration;
    if (mode === TimerMode.SHORT_BREAK) duration = settings.shortBreakDuration;
    if (mode === TimerMode.LONG_BREAK) duration = settings.longBreakDuration;
    setTimeLeft(duration);
    setIsActive(false);
    if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
    }
  }, [mode, settings]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setIsActive(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setIsActive(false);
            
            // Play notification sound
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => console.log("Audio play failed", e));
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  return {
    mode,
    timeLeft,
    isActive,
    settings,
    setSettings,
    switchMode,
    toggleTimer,
    resetTimer,
    setTimeLeft // Exposed for dragging or manual adjustment if needed
  };
};