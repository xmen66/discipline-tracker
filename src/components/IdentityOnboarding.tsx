import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Zap, Target, Plus, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface Props {
  onComplete: (selectedNames: string[]) => void;
  initialDisciplines?: string[];
}

export const IdentityOnboarding: React.FC<Props> = ({ onComplete, initialDisciplines = [] }) => {
  const [step, setStep] = useState(initialDisciplines.length > 0 ? 2 : 1);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(initialDisciplines);
  const [customDiscipline, setCustomDiscipline] = useState('');

  const addDiscipline = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (customDiscipline.trim() && !selectedHabits.includes(customDiscipline.trim())) {
      setSelectedHabits(prev => [...prev, customDiscipline.trim()]);
      setCustomDiscipline('');
    }
  };

  const removeDiscipline = (habit: string) => {
    setSelectedHabits(prev => prev.filter(h => h !== habit));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col p-6 md:p-12">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Zap className="w-6 h-6 text-black" fill="currentColor" />
            </div>
            <div>
              <h1 className="font-black tracking-tighter text-2xl leading-none italic">SMASH FIND</h1>
              <p className="text-[10px] text-[#10b981] font-bold tracking-[0.3em] mt-1 uppercase">Protocol Elite</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={cn(
                  "h-1 w-8 rounded-full transition-colors",
                  step >= i ? "bg-emerald-500" : "bg-neutral-800"
                )} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Who are you <br />
                <span className="text-emerald-500">becoming?</span>
              </h1>
              <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Identity-based habits are the most powerful engine for human transformation. We do not just track actions; we engineer a new self. The difference between those who achieve absolute mastery and those who stagnate is the clarity of their identity. When you define who you are becoming, every choice becomes an affirmation of that truth. This is the SMASH FIND protocol: a high-stakes alignment of your daily disciplines with your strategic vision. Every step, every gram of nutrition, and every hour of deep work is a vote for the person you are evolving into. You are the architect of your own evolution. Select the disciplines that will serve as the foundation of your new elite reality. The journey to the top of the hierarchy begins with a single, non-negotiable commitment to excellence. Establish your protocol. Become the master of your internal system.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 mx-auto hover:bg-emerald-500 transition-colors group"
              >
                Choose Your Path
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Build Your Identity</h2>
                <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Select at least 5 disciplines to start your system.</p>
              </div>

              <form onSubmit={addDiscipline} className="relative mb-8">
                <input 
                  type="text"
                  placeholder="Type a discipline (e.g. 5AM Wake Up, Deep Work, etc.)"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-5 px-6 pr-20 focus:border-emerald-500 outline-none transition-colors text-lg font-bold"
                  value={customDiscipline}
                  onChange={(e) => setCustomDiscipline(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-black p-2 rounded-xl hover:bg-emerald-400 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              <div className="flex-1 overflow-y-auto max-h-[45vh] pr-2 scrollbar-hide">
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {selectedHabits.map((habit) => (
                      <motion.button
                        key={habit}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => removeDiscipline(habit)}
                        className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all group"
                      >
                        {habit}
                        <X className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                {selectedHabits.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 border-2 border-dashed border-neutral-900 rounded-[2.5rem] py-20">
                    <Target className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No disciplines defined yet</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between items-center bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-neutral-900 shadow-2xl">
                <div className="flex flex-col">
                  <span className="text-4xl font-black italic tracking-tighter text-emerald-500">{selectedHabits.length}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Disciplines Locked</span>
                </div>
                <button 
                  disabled={selectedHabits.length < 5}
                  onClick={() => setStep(3)}
                  className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
                >
                  Initialize Protocol
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center text-center"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <Check className="w-10 h-10 text-black" strokeWidth={3} />
              </div>
              <h2 className="text-4xl font-bold mb-4">Identity Established.</h2>
              <p className="text-neutral-400 text-lg mb-12 max-w-md mx-auto">
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
              </p>
              <button 
                onClick={() => onComplete(selectedHabits)}
                className="bg-emerald-500 text-black px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform"
              >
                Enter The System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
