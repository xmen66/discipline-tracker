import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Calendar, Flag, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Goal {
  id: string;
  title: string;
  deadline: string;
  category: string;
  completed: boolean;
}

export const VisionBoard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Complete 75 Hard Challenge', deadline: '2025-06-01', category: 'Physical', completed: false },
    { id: '2', title: 'Achieve $10k Monthly Recurring Revenue', deadline: '2025-12-31', category: 'Financial', completed: false },
    { id: '3', title: 'Master Stoic Principles', deadline: '2025-03-15', category: 'Mental', completed: true },
  ]);

  const [newGoal, setNewGoal] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const addGoal = () => {
    if (newGoal.trim() && newDeadline) {
      const goal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGoal,
        deadline: newDeadline,
        category: 'Personal',
        completed: false,
      };
      setGoals([...goals, goal]);
      setNewGoal('');
      setNewDeadline('');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div>
        <h2 className="text-4xl font-black italic tracking-tighter">VISION BOARD</h2>
        <p className="text-[#10b981] font-bold uppercase text-xs tracking-[0.2em] mt-2">Long-Term Strategic Objectives</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Goal Form */}
        <div className="lg:col-span-1 bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8 shadow-xl h-fit">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#10b981]" />
            Define Target
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2 block">Objective Title</label>
              <input 
                type="text" 
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="e.g. Run a Marathon"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 outline-none focus:border-[#10b981] transition-colors font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2 block">Target Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input 
                  type="date" 
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#10b981] transition-colors font-bold text-neutral-300"
                />
              </div>
            </div>
            <button 
              onClick={addGoal}
              className="w-full bg-[#10b981] text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0da975] transition-all mt-4"
            >
              Lock Target
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "bg-[#0a0a0a] border p-6 rounded-[2rem] flex items-center justify-between transition-all group",
                  goal.completed ? "border-emerald-500/20 opacity-60" : "border-neutral-900 hover:border-neutral-700"
                )}
              >
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all",
                      goal.completed ? "bg-emerald-500 border-emerald-500" : "border-neutral-800 hover:border-neutral-600"
                    )}
                  >
                    {goal.completed && <CheckCircle2 className="w-6 h-6 text-black" />}
                  </button>
                  <div>
                    <h4 className={cn("text-xl font-bold tracking-tight", goal.completed ? "text-neutral-500 line-through" : "text-white")}>
                      {goal.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{goal.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#10b981]/60">
                        <Flag className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{goal.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="p-3 text-neutral-700 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {goals.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-neutral-900 rounded-[2.5rem]">
              <Target className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
              <p className="text-neutral-600 font-bold uppercase tracking-widest">No Active Strategic Targets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
