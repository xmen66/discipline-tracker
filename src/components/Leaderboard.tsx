import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, TrendingUp, Users, Zap, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
import { subscribeToLeaderboard, subscribeToGlobalFeed } from '../lib/sync';
import { FeedEvent } from '../types';

interface LeaderboardProps {
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubLeaders = subscribeToLeaderboard((data) => {
      setLeaders(data);
      setLoading(false);
    });

    const unsubFeed = subscribeToGlobalFeed((data) => {
      setFeed(data);
    });

    return () => {
      unsubLeaders();
      unsubFeed();
    };
  }, []);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const communityStats = leaders.length > 0 ? {
    avgScore: Math.round(leaders.reduce((acc, curr) => acc + (curr.score || 0), 0) / leaders.length),
    totalUsers: leaders.length,
    topScore: leaders[0]?.score || 0,
    topName: leaders[0]?.displayName || 'System'
  } : { avgScore: 0, totalUsers: 0, topScore: 0, topName: '---' };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Master': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Ace': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Platinum': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Gold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Silver': return 'bg-slate-400/20 text-slate-400 border-slate-400/30';
      case 'Bronze': return 'bg-orange-800/20 text-orange-600 border-orange-800/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase italic">Leaderboard</h2>
          <p className="text-[#10b981] font-bold uppercase text-xs tracking-[0.2em] mt-2">Global Hierarchy of Discipline</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
          <Users className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-500 font-bold text-sm uppercase tracking-widest">{communityStats.totalUsers} ACTIVE PROTOCOLS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-[2rem] p-6 relative overflow-hidden group">
          <Crown className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/10 group-hover:scale-110 transition-transform" />
          <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-1">Top Performer</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4 truncate pr-8">{communityStats.topName.toUpperCase()}</div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-neutral-400">Score: {communityStats.topScore}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-[2rem] p-6">
          <h4 className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-1">Community Score</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4">{communityStats.avgScore} AVG</div>
          <p className="text-xs font-bold text-neutral-400 leading-relaxed">The global discipline average is rising. Keep pushing the standard.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-[2rem] p-6">
          <h4 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-1">User Base</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4">{communityStats.totalUsers} USERS</div>
          <p className="text-xs font-bold text-neutral-400 leading-relaxed">Join the global elite in the pursuit of absolute discipline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-neutral-900 bg-neutral-900/30">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                GLOBAL RANKINGS
              </h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-900/50">
            {loading ? (
              <div className="p-12 text-center text-neutral-500 font-bold uppercase tracking-widest">
                Scanning Global Grid...
              </div>
            ) : leaders.length > 0 ? (
              leaders.map((leader, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={leader.uid}
                  className={cn(
                    "p-6 flex items-center justify-between group transition-colors",
                    leader.uid === currentUserId ? "bg-emerald-500/5 border-l-4 border-l-emerald-500" : "hover:bg-neutral-900/50"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "font-black italic text-xl w-8",
                      idx === 0 ? "text-amber-500" : idx === 1 ? "text-neutral-300" : idx === 2 ? "text-amber-700" : "text-neutral-700"
                    )}>
                      {idx + 1}
                    </span>
                    <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {leader.avatar || '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={cn("font-bold text-lg flex items-center gap-2", leader.uid === currentUserId ? "text-emerald-500" : "text-neutral-200")}>
                          {leader.displayName || 'Warrior'}
                        </h4>
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider",
                          getTierBadge(leader.tier || 'Bronze')
                        )}>
                          {leader.tier || 'Bronze'}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-bold bg-neutral-900 px-1.5 py-0.5 rounded">LVL {leader.level || 1}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{leader.title || 'The Drifter'}</p>
                        {idx < 3 && <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-black uppercase">ELITE</span>}
                        {leader.uid === currentUserId && <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded uppercase font-black">ACTIVE</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black italic tracking-tighter">{leader.score || 0}</div>
                    <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">SCORE</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-neutral-500">No other protocols detected in the grid.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8 max-h-[700px] flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-[#10b981]" />
              <h3 className="font-bold text-lg tracking-tight uppercase italic">Live Protocol Feed</h3>
            </div>
            <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide flex-1">
              <AnimatePresence initial={false}>
                {feed.map((event) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    key={event.id} 
                    className="flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs shrink-0 shadow-inner">
                      {event.userAvatar || '👤'}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-relaxed">
                        <span className="font-bold text-white">{event.userName}</span>
                        <span className="text-neutral-400"> {event.content}</span>
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {feed.length === 0 && (
                <div className="text-center py-12">
                   <MessageSquare className="w-10 h-10 text-neutral-900 mx-auto mb-4" />
                   <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Quiet in the grid...</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] p-6">
             <h4 className="font-black italic tracking-tighter text-emerald-500 mb-2">SYSTEM TIP</h4>
             <p className="text-xs text-neutral-400 leading-relaxed">
               Engagement with the global grid increases discipline accountability. Your actions are recorded for the collective advancement of the 1%.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
