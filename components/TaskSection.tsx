import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Sparkles, Loader2 } from 'lucide-react';
import { generateTasksFromGoal } from '../services/geminiService';

interface TaskSectionProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  tasks,
  setTasks,
  currentTaskId,
  setCurrentTaskId,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiGoal, setAiGoal] = useState('');

  const addTask = (title: string, est: number = 1) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      estimatedPomodoros: est,
      completedPomodoros: 0,
    };
    setTasks((prev) => [...prev, newTask]);
    if (!currentTaskId) setCurrentTaskId(newTask.id);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const handleAIGenerate = async () => {
    if (!aiGoal.trim()) return;
    setIsAIGenerating(true);
    try {
      const result = await generateTasksFromGoal(aiGoal);
      const newTasks = result.tasks.map(t => ({
        id: crypto.randomUUID(),
        title: t.title,
        completed: false,
        estimatedPomodoros: t.estimatedPomodoros,
        completedPomodoros: 0
      }));
      setTasks(prev => [...prev, ...newTasks]);
      if (!currentTaskId && newTasks.length > 0) setCurrentTaskId(newTasks[0].id);
      setAiGoal('');
      setShowAIInput(false);
    } catch (error) {
      alert("Failed to generate tasks. Please try again or check your API key.");
    } finally {
      setIsAIGenerating(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
    if (currentTaskId === id) setCurrentTaskId(null);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
        <button
          onClick={() => setShowAIInput(!showAIInput)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            showAIInput ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          <Sparkles size={14} />
          {showAIInput ? 'Cancel AI' : 'AI Plan'}
        </button>
      </div>

      <div className="p-6">
        {showAIInput && (
            <div className="mb-6 bg-indigo-50 p-4 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-indigo-900 mb-2">
                    What's your goal for today?
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={aiGoal}
                        onChange={(e) => setAiGoal(e.target.value)}
                        placeholder="e.g. Study React Hooks, Write a blog post..."
                        className="flex-1 px-4 py-2 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                    />
                    <button 
                        onClick={handleAIGenerate}
                        disabled={isAIGenerating}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                        {isAIGenerating ? <Loader2 size={18} className="animate-spin" /> : 'Go'}
                    </button>
                </div>
                <p className="text-xs text-indigo-400 mt-2">Powered by Gemini. Helps break goals into small tasks.</p>
            </div>
        )}

        {!showAIInput && (
            <form onSubmit={handleManualSubmit} className="mb-6 relative">
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all placeholder:text-gray-400"
            />
            <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
                <Plus size={20} />
            </button>
            </form>
        )}

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400 italic">
                No tasks yet. Add one or ask AI!
            </div>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setCurrentTaskId(task.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                currentTaskId === task.id
                  ? 'border-rose-200 bg-rose-50/50 ring-1 ring-rose-200'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                  className={`transition-colors ${task.completed ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'}`}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <span className={`font-medium truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
                  {task.completedPomodoros} / {task.estimatedPomodoros} 🍅
                </span>
                <button
                  onClick={(e) => deleteTask(task.id, e)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};