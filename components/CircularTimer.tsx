import React from 'react';
import { TimerMode } from '../types';
import { MODE_COLORS, MODE_LABELS } from '../constants';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  mode: TimerMode;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  timeLeft,
  totalTime,
  mode,
  isActive,
  onToggle,
  onReset,
}) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const dashoffset = circumference * (1 - progress);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const colorClass = MODE_COLORS[mode].split(' ')[1]; // Extract stroke-color

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r={radius}
            className="stroke-gray-200"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="160"
            cy="160"
            r={radius}
            className={`transition-all duration-1000 ease-linear ${colorClass}`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
          />
        </svg>

        <div className="z-10 flex flex-col items-center">
            <span className={`text-sm font-semibold tracking-widest uppercase mb-2 ${MODE_COLORS[mode].split(' ')[0]}`}>
                {MODE_LABELS[mode]}
            </span>
          <div className="text-7xl font-light tracking-tighter text-gray-800">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={onToggle}
              className={`p-4 rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                isActive ? 'bg-gray-100 text-gray-700' : `${MODE_COLORS[mode].split(' ')[2].replace('bg-', 'bg-')} ${MODE_COLORS[mode].split(' ')[0]}`
              } ${!isActive ? 'bg-opacity-100' : ''}`}
              style={{ backgroundColor: !isActive ? undefined : 'white' }}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1"/>}
            </button>
            <button
                onClick={onReset}
                className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shadow-md active:scale-95"
            >
                <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};