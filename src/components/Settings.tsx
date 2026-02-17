import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Upload, Trash2, 
  Smartphone, Bell, Shield, 
  SmartphoneIcon, Apple,
  Palette, Sun, Moon, Zap, Edit3
} from 'lucide-react';
import { UserState } from '../types';
import { cn } from '../utils/cn';
import { DEFAULT_AVATARS } from '../lib/auth';

interface Props {
  state: UserState;
  onLogout: () => void;
  onDeleteData: () => void;
  onStateUpdate: (newState: UserState) => void;
}

export const Settings: React.FC<Props> = ({ state, onLogout, onDeleteData, onStateUpdate }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(state.auth?.name || '');

  const xpForNextLevel = Math.pow(state.level, 2) * 100;
  const prevLevelXP = Math.pow(state.level - 1, 2) * 100;
  const currentLevelProgress = state.xp - prevLevelXP;
  const levelXPRequirement = xpForNextLevel - prevLevelXP;
  const progressPercentage = Math.max(0, Math.min((currentLevelProgress / levelXPRequirement) * 100, 100));

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Master': return 'from-purple-500 to-indigo-600';
      case 'Ace': return 'from-red-500 to-orange-600';
      case 'Platinum': return 'from-cyan-400 to-blue-500';
      case 'Gold': return 'from-amber-400 to-yellow-600';
      case 'Silver': return 'from-slate-300 to-slate-500';
      case 'Bronze': return 'from-orange-700 to-orange-900';
      default: return 'from-neutral-400 to-neutral-600';
    }
  };

  const accentColors = [
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Royal Blue', hex: '#3b82f6' },
    { name: 'Vivid Purple', hex: '#a855f7' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'White', hex: '#ffffff' },
  ];

  const updateAvatar = (avatar: string) => {
    if (!state.auth) return;
    onStateUpdate({
      ...state,
      auth: { ...state.auth, avatar }
    });
  };

  const saveName = () => {
    if (!state.auth || !newName.trim()) return;
    onStateUpdate({
      ...state,
      auth: { ...state.auth, name: newName }
    });
    setIsEditingName(false);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `smashfind_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onStateUpdate(json);
        alert("System protocol imported successfully.");
      } catch (err) {
        alert("Invalid protocol file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase italic">Configuration</h2>
        <p className="text-[#10b981] font-bold uppercase text-xs tracking-[0.3em] mt-2">SMASH FIND PROTOCOL CONTROL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Device & PWA */}
        <div className="space-y-6">
          <div className={cn(
            "rounded-[2rem] p-8 shadow-xl border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex items-center gap-3 mb-8">
              <Palette className="w-6 h-6 text-[var(--accent-color)]" />
              <h3 className="font-bold text-xl tracking-tight">System Visuals</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 block">Base Theme Control</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onStateUpdate({ ...state, theme: 'light' })}
                    className={cn(
                      "group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-500",
                      state.theme === 'light' 
                        ? "bg-white border-amber-200 shadow-[0_20px_40px_rgba(245,158,11,0.15)] scale-[1.02]" 
                        : "bg-slate-50 border-slate-100 text-slate-400 grayscale hover:grayscale-0 hover:bg-slate-100"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 shadow-inner",
                      state.theme === 'light' ? "bg-amber-100 scale-110" : "bg-slate-200"
                    )}>
                      <Sun className={cn("w-8 h-8 transition-transform duration-500", state.theme === 'light' ? "text-amber-600 rotate-0" : "text-slate-500 rotate-12")} />
                    </div>
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-[0.25em]",
                      state.theme === 'light' ? "text-amber-900" : "text-slate-500"
                    )}>DAY PROTOCOL</span>
                    {state.theme === 'light' && (
                      <motion.div 
                        layoutId="active-theme"
                        className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20" 
                      />
                    )}
                  </button>
                  
                  <button
                    onClick={() => onStateUpdate({ ...state, theme: 'dark' })}
                    className={cn(
                      "group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-500",
                      state.theme === 'dark' 
                        ? "bg-neutral-900 border-emerald-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[1.02]" 
                        : "bg-neutral-950 border-neutral-900 text-neutral-600 grayscale hover:grayscale-0 hover:bg-neutral-900"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 shadow-inner",
                      state.theme === 'dark' ? "bg-emerald-500/10 scale-110" : "bg-neutral-800"
                    )}>
                      <Moon className={cn("w-8 h-8 transition-transform duration-500", state.theme === 'dark' ? "text-emerald-400 rotate-0" : "text-neutral-500 -rotate-12")} />
                    </div>
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-[0.25em]",
                      state.theme === 'dark' ? "text-emerald-400" : "text-neutral-500"
                    )}>NIGHT PROTOCOL</span>
                    {state.theme === 'dark' && (
                      <motion.div 
                        layoutId="active-theme"
                        className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20" 
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 block">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => onStateUpdate({ ...state, accentColor: color.hex })}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center",
                        state.accentColor === color.hex ? "border-white" : "border-transparent"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {state.accentColor === color.hex && <Zap className="w-4 h-4 text-black mix-blend-difference" />}
                    </button>
                  ))}
                  <div className="relative group">
                    <input 
                      type="color"
                      value={state.accentColor}
                      onChange={(e) => onStateUpdate({ ...state, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-full border-2 border-transparent bg-neutral-800 cursor-pointer overflow-hidden appearance-none"
                    />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase hidden group-hover:block whitespace-nowrap">Custom</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-[2rem] p-8 shadow-xl border",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex items-center gap-3 mb-8">
              <Smartphone className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-xl tracking-tight">Deployment</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Install on iOS</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Tap the <strong>Share</strong> icon in Safari and select <strong>"Add to Home Screen"</strong> to use the app full-screen.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <SmartphoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Install on Android</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Tap the <strong>Menu (⋮)</strong> and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-[2rem] p-8 shadow-xl border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex items-center gap-3 mb-8">
              <Bell className="w-6 h-6 text-orange-500" />
              <h3 className="font-bold text-xl tracking-tight">Alert Protocols</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">SMASH Notifications</h4>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Browser Alerts</p>
                </div>
                <button 
                  onClick={() => {
                    const enabled = !state.notificationSettings.enabled;
                    if (enabled) {
                      Notification.requestPermission();
                    }
                    onStateUpdate({
                      ...state,
                      notificationSettings: { ...state.notificationSettings, enabled }
                    });
                  }}
                  className={`w-12 h-6 rounded-full relative transition-colors ${state.notificationSettings.enabled ? 'bg-emerald-500' : 'bg-neutral-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${state.notificationSettings.enabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "border rounded-2xl p-4 transition-colors",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
                )}>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block">Morning Brief</label>
                  <input 
                    type="time" 
                    value={state.notificationSettings.morningTime}
                    onChange={(e) => onStateUpdate({
                      ...state,
                      notificationSettings: { ...state.notificationSettings, morningTime: e.target.value }
                    })}
                    className={cn(
                      "bg-transparent text-sm font-bold w-full outline-none",
                      state.theme === 'light' ? "text-slate-900" : "text-white"
                    )}
                  />
                </div>
                <div className={cn(
                  "border rounded-2xl p-4 transition-colors",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
                )}>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase mb-1 block">Evening Ritual</label>
                  <input 
                    type="time" 
                    value={state.notificationSettings.eveningTime}
                    onChange={(e) => onStateUpdate({
                      ...state,
                      notificationSettings: { ...state.notificationSettings, eveningTime: e.target.value }
                    })}
                    className={cn(
                      "bg-transparent text-sm font-bold w-full outline-none",
                      state.theme === 'light' ? "text-slate-900" : "text-white"
                    )}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                <p className="text-[10px] text-orange-500/80 leading-relaxed font-bold uppercase tracking-widest">
                  Notifications require browser permission and work best on desktop or installed PWA.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Account */}
        <div className="space-y-6">
          <div className={cn(
            "rounded-[2rem] p-8 shadow-xl border transition-colors",
            state.theme === 'light' ? "bg-white border-slate-200" : "bg-[#0a0a0a] border-neutral-900"
          )}>
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-xl tracking-tight">Identity Profile</h3>
            </div>
            
            <div className={cn(
              "mb-8 p-6 border rounded-3xl transition-colors",
              state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
            )}>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                  {state.auth?.avatar || '👤'}
                </div>
                <div className="flex-1">
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-sm font-bold w-full outline-none focus:border-emerald-500"
                      />
                      <button 
                        onClick={saveName}
                        className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl">{state.auth?.name || 'Authorized User'}</h4>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">{state.auth?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r text-white shadow-lg",
                      getTierColor(state.tier)
                    )}>
                      {state.tier}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1 rounded-full">
                      Level {state.level}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-4 bg-neutral-900/30 rounded-2xl border border-neutral-800/50">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Protocol Experience</div>
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    {Math.round(currentLevelProgress)} / {levelXPRequirement} XP
                  </div>
                </div>
                <div className="h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                      getTierColor(state.tier)
                    )}
                  />
                </div>
                <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-[0.2em] mt-2 text-center">
                  Continue consistent action to advance to next protocol tier
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 block">Select Identity Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => updateAvatar(av)}
                      className={cn(
                        "w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all hover:scale-110",
                        state.auth?.avatar === av ? "bg-emerald-500 border-emerald-500 text-black" : "bg-neutral-900 border-neutral-800 grayscale hover:grayscale-0"
                      )}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={exportData}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 border rounded-3xl hover:bg-emerald-500/5 transition-colors",
                  state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
                )}
              >
                <Download className="w-6 h-6 text-neutral-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Export JSON</span>
              </button>
              
              <label className={cn(
                "flex flex-col items-center gap-3 p-6 border rounded-3xl hover:bg-emerald-500/5 transition-colors cursor-pointer",
                state.theme === 'light' ? "bg-slate-50 border-slate-200" : "bg-neutral-900/50 border-neutral-800"
              )}>
                <Upload className="w-6 h-6 text-neutral-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Import JSON</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            <button 
              onClick={onLogout}
              className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-neutral-900 text-neutral-400 border border-neutral-800 rounded-2xl font-bold hover:bg-neutral-800 hover:text-white transition-all mb-3"
            >
              Log Out
            </button>
            
            <button 
              onClick={onDeleteData}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all"
            >
              <Trash2 className="w-5 h-5" />
              DESTROY SYSTEM DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
