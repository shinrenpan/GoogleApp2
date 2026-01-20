import { TimerMode, TimerSettings } from './types';

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const MODE_COLORS = {
  [TimerMode.FOCUS]: 'text-rose-500 stroke-rose-500 bg-rose-50',
  [TimerMode.SHORT_BREAK]: 'text-teal-500 stroke-teal-500 bg-teal-50',
  [TimerMode.LONG_BREAK]: 'text-indigo-500 stroke-indigo-500 bg-indigo-50',
};

export const MODE_BG_COLORS = {
  [TimerMode.FOCUS]: 'bg-rose-500',
  [TimerMode.SHORT_BREAK]: 'bg-teal-500',
  [TimerMode.LONG_BREAK]: 'bg-indigo-500',
};

export const MODE_LABELS = {
  [TimerMode.FOCUS]: 'Focus',
  [TimerMode.SHORT_BREAK]: 'Short Break',
  [TimerMode.LONG_BREAK]: 'Long Break',
};