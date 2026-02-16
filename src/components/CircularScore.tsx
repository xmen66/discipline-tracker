import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  rank: string;
  streak: number;
}

import { cn } from '../utils/cn';

interface Props {
  score: number;
  rank: string;
  streak: number;
  theme?: string;
}

export const CircularScore: React.FC<Props> = ({ score, rank, streak, theme }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-64">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
        
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="transparent"
            stroke={theme === 'light' ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            fill="transparent"
            stroke="var(--accent-color)"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "text-6xl font-black tracking-tighter",
              theme === 'light' ? "text-slate-900" : "text-white"
            )}
          >
            {score}
          </motion.span>
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            SMASH FIND SCORE
          </span>
        </div>

        {/* Streak badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          <span className="text-sm">🔥</span> {streak} DAY STREAK
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-2">Current Identity</h3>
        <div className={cn(
          "inline-block border px-6 py-2 rounded-2xl shadow-xl transition-colors",
          theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
        )}>
          <span className="text-xl font-bold" style={{ color: 'var(--accent-color)' }}>
            {rank}
          </span>
        </div>
      </div>
    </div>
  );
};
