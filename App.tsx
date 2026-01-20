import React, { useState, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { CircularTimer } from './components/CircularTimer';
import { TaskSection } from './components/TaskSection';
import { TimerMode, Task } from './types';
import { MODE_COLORS, MODE_BG_COLORS } from './constants';
import { Settings, Coffee, Brain, Armchair } from 'lucide-react';

const App: React.FC = () => {
  const { 
    mode, 
    timeLeft, 
    isActive, 
    settings, 
    switchMode, 
    toggleTimer, 
    resetTimer 
  } = useTimer();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  // Auto-increment pomodoro count for current task when focus timer finishes
  useEffect(() => {
    if (mode === TimerMode.FOCUS && timeLeft === 0 && currentTaskId) {
      setTasks(prev => prev.map(t => 
        t.id === currentTaskId 
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
          : t
      ));
    }
  }, [mode, timeLeft, currentTaskId]);

  const currentTask = tasks.find(t => t.id === currentTaskId);
  
  const getDurationForMode = (m: TimerMode) => {
      switch(m) {
          case TimerMode.FOCUS: return settings.focusDuration;
          case TimerMode.SHORT_BREAK: return settings.shortBreakDuration;
          case TimerMode.LONG_BREAK: return settings.longBreakDuration;
      }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ease-in-out ${MODE_BG_COLORS[mode]} bg-opacity-10`}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${MODE_BG_COLORS[mode]} text-white`}>
                <span className="text-lg">🍅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">ZenPomodoro</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200/50 transition-colors text-gray-600">
            <Settings size={24} />
          </button>
        </header>

        {/* Main Content Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Timer */}
            <div className="flex flex-col items-center">
                {/* Mode Switcher */}
                <div className="bg-gray-100 p-1.5 rounded-full flex gap-1 mb-12 shadow-inner">
                    <button
                        onClick={() => switchMode(TimerMode.FOCUS)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            mode === TimerMode.FOCUS 
                            ? 'bg-white text-rose-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Brain size={16} /> Focus
                    </button>
                    <button
                        onClick={() => switchMode(TimerMode.SHORT_BREAK)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            mode === TimerMode.SHORT_BREAK 
                            ? 'bg-white text-teal-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Coffee size={16} /> Short Break
                    </button>
                    <button
                        onClick={() => switchMode(TimerMode.LONG_BREAK)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            mode === TimerMode.LONG_BREAK 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Armchair size={16} /> Long Break
                    </button>
                </div>

                {/* Timer Visualization */}
                <CircularTimer
                    timeLeft={timeLeft}
                    totalTime={getDurationForMode(mode)}
                    mode={mode}
                    isActive={isActive}
                    onToggle={toggleTimer}
                    onReset={resetTimer}
                />

                {/* Current Task Display */}
                <div className="mt-12 text-center h-16">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Current Task</p>
                    {currentTask ? (
                        <p className="text-xl font-semibold text-gray-800 line-clamp-1 px-4">
                            {currentTask.title}
                        </p>
                    ) : (
                        <p className="text-lg text-gray-400 italic">Select a task to focus on</p>
                    )}
                </div>
            </div>

            {/* Right Column: Tasks */}
            <div className="w-full">
                <TaskSection 
                    tasks={tasks} 
                    setTasks={setTasks} 
                    currentTaskId={currentTaskId} 
                    setCurrentTaskId={setCurrentTaskId} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;