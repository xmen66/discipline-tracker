import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, Trophy, BarChart3, 
  Droplets, Scale, CheckCircle2,
  Calendar, AlertCircle, Smartphone, X,
  Activity, Flame, Footprints, Zap, Users
} from 'lucide-react';
import { useActiveProtocols } from '../hooks/useActiveProtocols';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import confetti from 'canvas-confetti';

import { UserState } from '../types';
import { DisciplineEngine } from '../utils/DisciplineEngine';
import { CircularScore } from './CircularScore';
import { cn } from '../utils/cn';

const MOCK_HISTORY = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 85 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 92 },
  { day: 'Sat', score: 88 },
  { day: 'Sun', score: 95 },
];

interface Props {
  state: UserState;
  onStateUpdate: (state: UserState) => void;
  onSealPromise: (promise: string) => void;
  onLogout: () => void;
  showOnlyStats?: boolean;
}

import { DownloadModal } from './DownloadModal';
import { useStepTracker } from '../hooks/useStepTracker';

export const Dashboard: React.FC<Props> = ({ state, onStateUpdate, onSealPromise, showOnlyStats = false }) => {
  const activeProtocols = useActiveProtocols(156);
  const { steps: autoSteps, isTracking, startTracking, stopTracking } = useStepTracker(state.auth?.uid);

  useEffect(() => {
    if (autoSteps > state.steps) {
      const newSteps = autoSteps;
      const newCalories = Math.round(newSteps * 0.042);
      onStateUpdate({
        ...state,
        steps: newSteps,
        calories: newCalories
      });
    }
  }, [autoSteps]);
  const [showPromiseModal, setShowPromiseModal] = useState(false);
  const [showDownloadBanner, setShowDownloadBanner] = useState(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [promise, setPromise] = useState('');
  
  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert("Focus Session Complete. Discipline Reinforced.");
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate score
  const currentScore = useMemo(() => DisciplineEngine.calculateScore(state), [state]);
  const rank = useMemo(() => DisciplineEngine.getRank(currentScore), [currentScore]);

  // Check for 8PM alert
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 20 && currentScore < 80) {
        console.warn("⚠️ Streak At Risk!");
      }
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [currentScore]);

  // Confetti on 100
  useEffect(() => {
    if (currentScore === 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#ffffff']
      });
    }
  }, [currentScore]);

  const toggleHabit = (id: string) => {
    const habit = state.habits.find(h => h.id === id);
    const newCompleted = !habit?.completed;
    
    onStateUpdate({
      ...state,
      habits: state.habits.map(h => 
        h.id === id ? { ...h, completed: newCompleted } : h
      )
    });

    if (newCompleted && state.auth && habit) {
      import('../lib/sync').then(({ broadcastProtocolEvent }) => {
        broadcastProtocolEvent({
          userId: state.auth!.uid,
          userName: state.auth!.name,
          userAvatar: state.auth!.avatar || '👤',
          type: 'habit_completed',
          content: `completed discipline: ${habit.name}`
        });
      });
    }
  };

  const adjustWater = (amount: number) => {
    onStateUpdate({
      ...state,
      waterIntake: Math.max(0, state.waterIntake + amount)
    });
  };

  const adjustSteps = (amount: number) => {
    const newSteps = Math.max(0, state.steps + amount);
    // Refined Calories: ~0.04 calories per step average
    const newCalories = Math.round(newSteps * 0.042);
    onStateUpdate({
      ...state,
      steps: newSteps,
      calories: newCalories
    });
  };

  // SMASH FIND Precision Water Logic: Base 2000ml + 35ml for every 100 kcal burned
  const waterTarget = useMemo(() => {
    const base = 2000;
    const additional = Math.floor(state.calories / 100) * 35;
    return base + additional;
  }, [state.calories]);

  const updateWeight = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onStateUpdate({ ...state, weight: num });
    }
  };

  const handlePromiseSubmit = () => {
    if (promise.trim()) {
      onSealPromise(promise);
      setShowPromiseModal(false);
      setPromise('');
      confetti({
        particleCount: 40,
        origin: { y: 0.8 }
      });
    }
  };

  if (showOnlyStats) {
    return (
      <div className="space-y-8">
        <h2 className="text-4xl font-black italic tracking-tighter">ANALYTICS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-6 h-6 text-emerald-500" />
                <h3 className="font-bold text-xl tracking-tight">7-Day Momentum</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_HISTORY}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                    <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-xl tracking-tight">Identity Progress</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Physical Discipline', value: 85, color: 'bg-rose-500' },
                  { label: 'Mental Focus', value: 62, color: 'bg-amber-500' },
                  { label: 'Financial Health', value: 45, color: 'bg-emerald-500' },
                  { label: 'Social Momentum', value: 92, color: 'bg-blue-500' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</span>
                      <span className="text-sm font-black">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        className={cn("h-full", stat.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase italic">Control</h2>
          <p className="text-[#10b981] font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Status: Operational</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#0a0a0a] border border-neutral-900 px-4 py-2 rounded-2xl flex items-center gap-3">
             <div className="relative">
                <Users className="w-4 h-4 text-emerald-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-white tabular-nums">{activeProtocols}</span>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Protocols Active</span>
             </div>
          </div>
          <div className="bg-[#0a0a0a] border border-neutral-900 px-4 py-2 rounded-2xl flex items-center gap-3">
             <div className="relative">
                <Zap className="w-4 h-4 text-amber-500" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-white tabular-nums">{state.streak}</span>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Current Streak</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDownloadBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div 
              style={{ backgroundColor: 'var(--accent-color)' }}
              className="rounded-3xl p-1 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-4 px-6 py-3">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-black font-black italic tracking-tighter text-sm">INSTALL SMASH FIND</h4>
                  <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">Elite Native Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-4">
                <button 
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="bg-black text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Get SMASH FIND
                </button>
                <button 
                  onClick={() => setShowDownloadBanner(false)}
                  className="p-2 text-black/40 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className={cn(
            "rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="w-24 h-24" />
            </div>
            <CircularScore score={currentScore} rank={rank} streak={state.streak} theme={state.theme} />
          </div>

          {/* SMASH FIND Activity Card */}
          <div className={cn(
            "rounded-[2rem] p-6 shadow-xl relative overflow-hidden border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div 
                  style={{ backgroundColor: 'var(--accent-color)', opacity: 0.2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                />
                <Activity 
                  className="w-5 h-5 absolute translate-x-2.5" 
                  style={{ color: 'var(--accent-color)' }}
                />
                <h3 className="font-bold ml-12 uppercase tracking-tighter italic">Metabolic Engine</h3>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] font-black text-orange-500 uppercase">{state.calories} CALS</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={isTracking ? stopTracking : startTracking}
                  style={{ 
                    backgroundColor: isTracking ? 'transparent' : 'var(--accent-color)',
                    borderColor: isTracking ? 'var(--accent-color)' : 'transparent',
                    color: isTracking ? 'var(--accent-color)' : 'black'
                  }}
                  className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Activity className={cn("w-4 h-4", isTracking && "animate-pulse")} />
                  {isTracking ? 'TRACKING ACTIVE' : 'START MOMENTUM TRACKER'}
                </button>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Movement Pattern</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black italic tracking-tighter">{state.steps.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-neutral-500 ml-1">/ 10,000</span>
                    </div>
                  </div>
                  <div className="h-3 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((state.steps / 10000) * 100, 100)}%` }}
                      style={{ backgroundColor: 'var(--accent-color)' }}
                      className="h-full rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => adjustSteps(1000)}
                  className={cn(
                    "border py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group hover:border-[var(--accent-color)]/50",
                    state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                  )}
                >
                  <span className="text-lg font-black italic tracking-tighter">+1,000</span>
                  <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Add Steps</span>
                </button>
                <button 
                  onClick={() => adjustSteps(-1000)}
                  className={cn(
                    "border py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 opacity-50 hover:opacity-100",
                    state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                  )}
                >
                  <span className="text-lg font-black italic tracking-tighter">-1,000</span>
                  <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Correction</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hydration Card (Dynamic) */}
          <div className={cn(
            "rounded-[2rem] p-6 shadow-xl relative overflow-hidden border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Hydration</h3>
              </div>
              <span className="text-blue-400 font-mono font-bold">{(state.waterIntake / 1000).toFixed(1)}L <span className="text-neutral-500">/ {(waterTarget/1000).toFixed(1)}L</span></span>
            </div>
            
            <div className="h-4 bg-neutral-900 rounded-full mb-6 overflow-hidden border border-neutral-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((state.waterIntake / waterTarget) * 100, 100)}%` }}
                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => adjustWater(250)}
                className={cn(
                  "border py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                )}
              >
                <Plus className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold">250ml</span>
              </button>
              <button 
                onClick={() => adjustWater(-250)}
                className={cn(
                  "border py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 opacity-50",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                )}
              >
                <Minus className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-bold">Remove</span>
              </button>
            </div>
            <p className="mt-4 text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center">Requirement adjusted for activity</p>
          </div>

          {/* Weight & Sleep Card */}
          <div className={cn(
            "rounded-[2rem] p-6 shadow-xl border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Biometrics</h3>
              </div>
              <div className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded tracking-widest uppercase italic">Active</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className={cn(
                  "flex-1 border rounded-2xl p-4 transition-colors",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                )}>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block">Weight (KG)</label>
                  <input 
                    type="number" 
                    value={state.weight || ''} 
                    onChange={(e) => updateWeight(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-xl font-bold w-full outline-none text-rose-500"
                  />
                </div>
                <div className={cn(
                  "flex-1 border rounded-2xl p-4 transition-colors",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
                )}>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block">Sleep (HRS)</label>
                  <input 
                    type="number" 
                    value={state.sleepHours || ''} 
                    onChange={(e) => onStateUpdate({ ...state, sleepHours: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                    className="bg-transparent text-xl font-bold w-full outline-none text-blue-500"
                  />
                </div>
              </div>
              <div className={cn(
                "border rounded-2xl p-4 transition-colors",
                state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Sleep Quality</label>
                  <span className="text-xs font-black text-blue-400">{state.sleepQuality}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={state.sleepQuality}
                  onChange={(e) => onStateUpdate({ ...state, sleepQuality: parseInt(e.target.value) })}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Protocol Monitor & BMR */}
          <div className={cn(
            "rounded-[2rem] p-6 shadow-xl border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold">Protocol Monitor</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-2xl border",
                state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
              )}>
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block mb-1">BMR (EST.)</span>
                <span className="text-lg font-black italic tracking-tighter">
                  {state.weight > 0 ? Math.round(10 * state.weight + 6.25 * 175 - 5 * 30 + 5) : '0'} <span className="text-[10px] text-neutral-500 font-bold not-italic">KCAL</span>
                </span>
              </div>
              <div className={cn(
                "p-4 rounded-2xl border",
                state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900 border-neutral-800"
              )}>
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block mb-1">Recovery</span>
                <span className="text-lg font-black italic tracking-tighter text-blue-400">
                  {Math.round((state.sleepQuality * 0.7) + (Math.min(state.sleepHours / 8, 1) * 30))}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800/30">
               <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                 <span>Metabolic Stress</span>
                 <span>{currentScore > 70 ? 'Optimal' : 'Elevated'}</span>
               </div>
               <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${100 - currentScore}%` }}
                   className="h-full bg-rose-500/50"
                 />
               </div>
            </div>
          </div>

          {/* Stoic AI Card */}
          <div className="bg-gradient-to-br from-neutral-900 to-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-6 shadow-xl overflow-hidden relative">
            <div className="flex items-center gap-3 mb-4">
              <div 
                style={{ backgroundColor: 'var(--accent-color)', opacity: 0.1 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
              />
              <AlertCircle 
                className="w-5 h-5 absolute translate-x-2.5"
                style={{ color: 'var(--accent-color)' }}
              />
              <h3 className="font-bold tracking-tight ml-10">Stoic Directive</h3>
            </div>
            <p className="text-sm text-neutral-400 italic leading-relaxed">
              {currentScore < 40 
                ? "The impediment to action advances action. What stands in the way becomes the way. Your current state demands immediate redirection."
                : currentScore < 80 
                ? "Waste no more time arguing about what a good man should be. Be one. You have momentum; do not let it wither in comfort."
                : "Excellence is a habit. You are currently embodying the Stoic ideal. Guard this state as your most precious possession."}
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
               <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">Marcus Aurelius</span>
               <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                 <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                 <div className="w-1 h-1 rounded-full bg-neutral-800" />
               </div>
            </div>
          </div>

          {/* New Feature: Dopamine Control */}
          <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-6 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">Dopamine Shield</h3>
                </div>
             </div>
             <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-4 leading-relaxed">
               Silence the noise. This protocol hides reward animations for maximum stoic focus.
             </p>
             <button 
               className={cn(
                 "w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all",
                 state.isPro ? "bg-neutral-900 text-neutral-500 border-neutral-800" : "bg-purple-500 text-black border-purple-400"
               )}
               onClick={() => onStateUpdate({ ...state, isPro: !state.isPro })}
             >
               {state.isPro ? "Shield Deactivated" : "Shield Active"}
             </button>
          </div>
        </div>

        {/* Right Column: Habits & Analytics Preview */}
        <div className="lg:col-span-8 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Focus Timer */}
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center justify-center text-center gap-6 group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
               </div>
               <div className="space-y-1">
                  <h3 className="text-emerald-500 font-black italic tracking-tighter text-[10px] uppercase tracking-widest">Protocol: Deep Work</h3>
                  <h4 className="text-5xl font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</h4>
               </div>
               
               <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setTimerActive(!timerActive)}
                    className={cn(
                      "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                      timerActive 
                        ? "bg-neutral-900 text-rose-500 border border-rose-500/30" 
                        : "bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                    )}
                  >
                    {timerActive ? 'Pause' : 'Engage'}
                  </button>
                  <button 
                    onClick={() => { setTimerActive(false); setTimeLeft(25 * 60); }}
                    className="px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors border border-neutral-800"
                  >
                    Reset
                  </button>
               </div>
            </div>

            {/* Critical Path */}
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8 shadow-xl space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-amber-500 font-black italic tracking-tighter text-[10px] uppercase tracking-widest">Critical Path</h3>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Top 3 Targets</span>
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map(i => {
                  const task = state.criticalPath[i];
                  return (
                    <div key={i} className="flex gap-3">
                      <button 
                        onClick={() => {
                          const newPath = [...state.criticalPath];
                          if (newPath[i]) {
                            newPath[i].completed = !newPath[i].completed;
                            onStateUpdate({ ...state, criticalPath: newPath });
                          }
                        }}
                        className={cn(
                          "w-10 h-10 rounded-xl border flex items-center justify-center transition-all shrink-0",
                          task?.completed ? "bg-amber-500 border-amber-500" : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                        )}
                      >
                        {task?.completed && <CheckCircle2 className="w-5 h-5 text-black" />}
                      </button>
                      <input 
                        type="text"
                        placeholder={`Objective ${i + 1}`}
                        value={task?.text || ''}
                        onChange={(e) => {
                          const newPath = [...state.criticalPath];
                          if (!newPath[i]) {
                            newPath[i] = { id: Math.random().toString(), text: e.target.value, completed: false };
                          } else {
                            newPath[i].text = e.target.value;
                          }
                          onStateUpdate({ ...state, criticalPath: newPath });
                        }}
                        className={cn(
                          "bg-transparent outline-none w-full font-bold text-sm border-b border-transparent focus:border-neutral-800 transition-colors",
                          task?.completed ? "text-neutral-600 line-through" : "text-neutral-300"
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Habits Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter">DAILY BATTLE</h2>
                <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-lg">
                  {state.habits.filter(h => h.completed).length} / {state.habits.length} DEFEATED
                </div>
              </div>

              <div className="space-y-3">
                {state.habits.map(habit => (
                  <motion.div 
                    key={habit.id}
                    layout
                    onClick={() => toggleHabit(habit.id)}
                    className={cn(
                      "group cursor-pointer p-4 rounded-3xl border transition-all flex items-center justify-between",
                      habit.completed 
                        ? "bg-emerald-500/10 border-emerald-500/30" 
                        : "bg-[#0a0a0a] border-neutral-900 hover:border-neutral-700"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        habit.completed ? "bg-emerald-500 border-emerald-500" : "border-neutral-800 group-hover:border-neutral-600"
                      )}>
                        {habit.completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <span className={cn("font-bold", habit.completed ? "text-white" : "text-neutral-400")}>
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{habit.category}</span>
                    </div>
                  </motion.div>
                ))}

                <button 
                  onClick={() => setShowPromiseModal(true)}
                  className="w-full p-6 border-2 border-dashed border-neutral-900 rounded-3xl text-neutral-600 font-bold hover:text-emerald-500 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  <span className="uppercase tracking-widest text-[10px]">The Daily Promise Ritual</span>
                </button>
              </div>
            </div>

            {/* Side Analytics Preview */}
            <div className="md:w-1/3 space-y-8">
              <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold">Trend</h3>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_HISTORY}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={state.accentColor} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={state.accentColor} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px' }}
                        itemStyle={{ color: state.accentColor }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke={state.accentColor} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Identity Insights */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-emerald-400">Psychology</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed italic">
                  "Your current {rank} status indicates high momentum. To reach the next level, focus on Physical consistency."
                </p>
              </div>

              {/* New: Morning Protocol Checklist */}
              <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-6 shadow-xl">
                 <h3 className="font-bold text-[10px] uppercase tracking-widest text-neutral-500 mb-4">Morning Protocol</h3>
                 <div className="space-y-3">
                   {[
                     "No Phone First 60m",
                     "Sunlight Exposure",
                     "Hydrate 500ml",
                     "Identify Top 3 Targets"
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-xs text-neutral-400 font-medium p-2 hover:bg-neutral-900/50 rounded-xl transition-colors">
                       <div className="w-4 h-4 rounded border border-neutral-800 shrink-0" />
                       {item}
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promise Modal */}
      <AnimatePresence>
        {showPromiseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPromiseModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-neutral-800 p-8 rounded-[2.5rem] max-w-lg w-full relative z-10 shadow-[0_0_100px_rgba(16,185,129,0.15)]"
            >
              <h2 className="text-3xl font-black italic tracking-tighter mb-4">THE DAILY PROMISE</h2>
              <p className="text-neutral-400 mb-8">What is the one commitment you kept to yourself today?</p>
              
              <textarea 
                value={promise}
                onChange={(e) => setPromise(e.target.value)}
                placeholder="Today I promised myself I would..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 h-40 outline-none focus:border-emerald-500 transition-colors text-lg"
              />

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => setShowPromiseModal(false)}
                  className="flex-1 py-4 font-bold text-neutral-500 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handlePromiseSubmit}
                  className="flex-[2] bg-white text-black py-4 rounded-2xl font-black hover:bg-emerald-500 transition-all"
                >
                  SEAL PROMISE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
