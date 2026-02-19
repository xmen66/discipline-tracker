import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart2, BookText, Trophy, Settings, Target, Zap, Download, Activity } from 'lucide-react';
import { cn } from '../utils/cn';
import { Theme } from '../types';
import { useActiveProtocols } from '../hooks/useActiveProtocols';

export type View = 'dashboard' | 'analytics' | 'vision' | 'journal' | 'leaderboard' | 'settings';

interface Props {
  activeView: View;
  onViewChange: (view: View) => void;
  onDownloadClick?: () => void;
  theme?: Theme;
  user?: { name: string; avatar?: string; email?: string; level?: number; tier?: string };
}

const Logo = ({ theme }: { theme?: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
      <Zap className="w-6 h-6 text-black" fill="currentColor" />
    </div>
    <div>
      <h1 className={cn(
        "font-black tracking-tighter text-2xl leading-none italic",
        theme === 'light' ? "text-slate-900" : "text-white"
      )}>SMASH FIND</h1>
      <p className="text-[10px] text-[#10b981] font-bold tracking-[0.3em] mt-1 uppercase">Protocol Elite</p>
    </div>
  </div>
);

export const BottomNav: React.FC<Props> = ({ activeView, onViewChange, onDownloadClick, theme, user }) => {
  const activeProtocols = useActiveProtocols(156);
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
    { id: 'vision', icon: Target, label: 'Vision' },
    { id: 'journal', icon: BookText, label: 'Logs' },
    { id: 'leaderboard', icon: Trophy, label: 'Rank' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ] as const;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-40 px-6 pb-8 pt-4 backdrop-blur-xl border-t md:hidden",
      theme === 'light' ? "bg-white/80 border-slate-200" : "bg-[#050505]/80 border-neutral-900"
    )}>
      {/* Active Protocols Mobile Badge */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
          <span className="text-white">{activeProtocols}</span> ACTIVE PROTOCOLS
        </span>
      </div>

      <div className="flex justify-between items-center">
        {user && (
           <button
             onClick={() => onViewChange('settings')}
             className="flex flex-col items-center gap-1"
           >
             <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center text-sm shadow-inner">
               {user.avatar || '👤'}
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">You</span>
           </button>
        )}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            style={activeView === tab.id ? { color: 'var(--accent-color)' } : {}}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeView === tab.id 
                ? "scale-110" 
                : theme === 'light' ? "text-slate-400" : "text-neutral-600 hover:text-neutral-400"
            )}
          >
            <tab.icon className="w-6 h-6" strokeWidth={activeView === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={onDownloadClick}
          className="flex flex-col items-center gap-1 text-[var(--accent-color)]"
        >
          <div className="p-1.5 bg-[var(--accent-color)]/10 rounded-lg">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Get</span>
        </button>
      </div>
    </nav>
  );
};

export const Sidebar: React.FC<Props> = ({ activeView, onViewChange, onDownloadClick, theme, user }) => {
  const activeProtocols = useActiveProtocols(156);
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'vision', icon: Target, label: 'Vision Board' },
    { id: 'journal', icon: BookText, label: 'History' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <aside className={cn(
      "hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r p-8 overflow-y-auto scrollbar-hide",
      theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
    )}>
      <div className="mb-8">
        <Logo theme={theme} />
      </div>

      {user && (
        <div 
          onClick={() => onViewChange('settings')}
          className={cn(
            "mb-8 p-4 rounded-2xl border flex items-center gap-3 cursor-pointer hover:bg-neutral-900 transition-colors group",
            theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
          )}
        >
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
            {user.avatar || '👤'}
          </div>
          <div className="min-w-0">
            <h4 className={cn(
              "font-bold text-sm truncate",
              theme === 'light' ? "text-slate-900" : "text-white"
            )}>{user.name}</h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-black bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">LVL {user.level || 1}</span>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest truncate">{user.tier || 'Bronze'}</span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            style={activeView === tab.id ? { backgroundColor: 'var(--accent-color)' } : {}}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm",
              activeView === tab.id 
                ? "text-black shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
                : theme === 'light' 
                  ? "text-slate-500 hover:bg-slate-100" 
                  : "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}

        <div className={cn(
          "pt-4 mt-4 border-t",
          theme === 'light' ? "border-slate-100" : "border-neutral-900"
        )}>
          <button
            onClick={onDownloadClick}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm text-[var(--accent-color)] bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/10"
          >
            <Download className="w-5 h-5" />
            Get SMASH FIND App
          </button>
        </div>
      </nav>

      <div className="mt-auto space-y-4">
        <div className={cn(
          "rounded-2xl p-4 border border-emerald-500/10 bg-emerald-500/5",
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Protocols</p>
            </div>
            <span className="text-[10px] font-black text-emerald-400 tabular-nums">{activeProtocols}</span>
          </div>
          <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "60%" }}
              animate={{ width: ["60%", "65%", "62%", "68%", "64%"] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        <div className={cn(
          "rounded-2xl p-4 border",
          theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
        )}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Protocol Sync</p>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          <p className={cn(
            "text-[10px] font-black italic tracking-tighter",
            theme === 'light' ? "text-slate-900" : "text-white"
          )}>ENCRYPTED & LOCAL</p>
        </div>

        <div className={cn(
          "rounded-2xl p-4 border",
          theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
        )}>
          <p className="text-[10px] text-neutral-500 font-bold uppercase mb-2">Protocol Insight</p>
          <p className={cn(
            "text-xs italic font-medium leading-relaxed",
            theme === 'light' ? "text-slate-600" : "text-neutral-400"
          )}>
            "SMASH the barriers between who you are and who you want to be."
          </p>
        </div>
      </div>
    </aside>
  );
};
