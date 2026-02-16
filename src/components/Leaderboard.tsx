import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, TrendingUp, Users, Zap, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';

const MOCK_LEADERS = [
  { rank: 1, name: 'Marcus Aurelius', score: 100, identity: 'Stoic Master', avatar: '🏛️' },
  { rank: 2, name: 'David Goggins', score: 99, identity: 'The Elite', avatar: '🏃' },
  { rank: 3, name: 'Jordan Peterson', score: 98, identity: 'The Elite', avatar: '🦞' },
  { rank: 4, name: 'Naval Ravikant', score: 95, identity: 'The Elite', avatar: '🧘' },
  { rank: 5, name: 'User (You)', score: 88, identity: 'The Warrior', avatar: '👤', isUser: true },
  { rank: 6, name: 'Andrew Huberman', score: 85, identity: 'The Warrior', avatar: '🧠' },
  { rank: 7, name: 'Tim Ferriss', score: 82, identity: 'The Warrior', avatar: '🛠️' },
];

const MOCK_FEED = [
  { id: 1, user: 'Goggins', action: 'completed 10k steps', time: '2m ago' },
  { id: 2, user: 'Aurelius', action: 'sealed Daily Promise', time: '5m ago' },
  { id: 3, user: 'Naval', action: 'finished Deep Work protocol', time: '12m ago' },
];

export const Leaderboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase italic">Leaderboard</h2>
          <p className="text-[#10b981] font-bold uppercase text-xs tracking-[0.2em] mt-2">Global Hierarchy of Discipline</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
          <Users className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-500 font-bold text-sm">4,281 ACTIVE PROTOCOLS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 rounded-[2rem] p-6 relative overflow-hidden group">
          <Crown className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-500/10 group-hover:scale-110 transition-transform" />
          <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-1">Top Performer</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4">MARCUS A.</div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-neutral-400">Streak: 365 DAYS</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-[2rem] p-6">
          <h4 className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-1">Community Score</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4">82.4 AVG</div>
          <p className="text-xs font-bold text-neutral-400 leading-relaxed">The global discipline average is rising. Keep pushing the standard.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-[2rem] p-6">
          <h4 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-1">Your Rank</h4>
          <div className="text-3xl font-black italic tracking-tighter mb-4">#5 / 4.2K</div>
          <p className="text-xs font-bold text-neutral-400 leading-relaxed">You are in the top 1% of disciplined individuals globally.</p>
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
              <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Live Updates Every 15M</span>
            </div>
          </div>

          <div className="divide-y divide-neutral-900/50">
            {MOCK_LEADERS.map((leader, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={leader.name}
                className={cn(
                  "p-6 flex items-center justify-between group transition-colors",
                  leader.isUser ? "bg-emerald-500/5 border-l-4 border-l-emerald-500" : "hover:bg-neutral-900/50"
                )}
              >
                <div className="flex items-center gap-6">
                  <span className={cn(
                    "font-black italic text-xl w-8",
                    idx === 0 ? "text-amber-500" : idx === 1 ? "text-neutral-300" : idx === 2 ? "text-amber-700" : "text-neutral-700"
                  )}>
                    {leader.rank}
                  </span>
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-2xl">
                    {leader.avatar}
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-lg", leader.isUser ? "text-emerald-500" : "text-neutral-200")}>
                      {leader.name} {leader.isUser && "(You)"}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{leader.identity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black italic tracking-tighter">{leader.score}</div>
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">SCORE</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-[#10b981]" />
              <h3 className="font-bold text-lg tracking-tight uppercase italic">Live Protocol Feed</h3>
            </div>
            <div className="space-y-6">
              {MOCK_FEED.map((post) => (
                <div key={post.id} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs">
                    {post.user[0]}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm leading-relaxed">
                      <span className="font-bold text-[#10b981]">{post.user}</span>
                      <span className="text-neutral-400"> {post.action}</span>
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase">
                      <MessageSquare className="w-3 h-3" />
                      {post.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
              View Global Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
