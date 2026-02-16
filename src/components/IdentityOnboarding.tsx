import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Search, Shield, Zap, Target, Heart } from 'lucide-react';
import { ALL_DISCIPLINES } from '../data/disciplines';
import { cn } from '../utils/cn';

interface Props {
  onComplete: (selectedIds: string[]) => void;
}

export const IdentityOnboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleHabit = (id: string) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const categories = [
    { name: 'Physical', icon: <Heart className="w-5 h-5" />, color: 'text-rose-400' },
    { name: 'Focus', icon: <Zap className="w-5 h-5" />, color: 'text-amber-400' },
    { name: 'Social/Financial', icon: <Shield className="w-5 h-5" />, color: 'text-emerald-400' },
    { name: 'Financial', icon: <Target className="w-5 h-5" />, color: 'text-blue-400' }
  ];

  const filteredHabits = ALL_DISCIPLINES.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">
                Identity-based habits are the most powerful. Select the disciplines that define your future self.
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
                <h2 className="text-2xl font-bold mb-2">Build Your Identity</h2>
                <p className="text-neutral-400">Select at least 5 disciplines to start your system.</p>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search 100+ disciplines..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 space-y-8 scrollbar-hide">
                {categories.map(cat => (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cat.color}>{cat.icon}</span>
                      <h3 className="font-semibold text-neutral-300 uppercase text-xs tracking-widest">{cat.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filteredHabits.filter(h => h.category === cat.name || (cat.name === 'Financial' && h.category === 'Social/Financial')).map(habit => (
                        <button
                          key={habit.id}
                          onClick={() => toggleHabit(habit.id)}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm transition-all flex items-center gap-2",
                            selectedHabits.includes(habit.id) 
                              ? "bg-emerald-500 border-emerald-500 text-black font-semibold" 
                              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"
                          )}
                        >
                          {selectedHabits.includes(habit.id) && <Check className="w-4 h-4" />}
                          {habit.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center bg-[#0a0a0a] p-6 rounded-3xl border border-neutral-900">
                <div>
                  <span className="text-3xl font-bold text-emerald-500">{selectedHabits.length}</span>
                  <span className="text-neutral-500 ml-2">Selected</span>
                </div>
                <button 
                  disabled={selectedHabits.length < 5}
                  onClick={() => setStep(3)}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
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
