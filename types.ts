export enum TimerMode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK'
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

export interface AITaskResponse {
  tasks: {
    title: string;
    estimatedPomodoros: number;
  }[];
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}