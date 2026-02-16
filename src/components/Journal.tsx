import React from 'react';
import { motion } from 'framer-motion';
import { BookText, Calendar, Search, Filter } from 'lucide-react';
import { UserState } from '../types';

interface Props {
  state: UserState;
}

export const Journal: React.FC<Props> = ({ state }) => {
  const history = Object.entries(state.dailyHistory).reverse();

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter">REFLECTIONS</h2>
          <p className="text-neutral-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Historical Database</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {history.length > 0 ? (
          history.map(([date, entry], idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={date}
              className="bg-[#0a0a0a] border border-neutral-900 rounded-[2rem] p-8 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
                    <span className="text-emerald-500 font-bold text-xs">Score: {entry.score}</span>
                  </div>
                </div>
                <div className="text-neutral-700 font-mono text-sm">#{history.length - idx}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-3">The Kept Promise</h5>
                  <p className="text-lg text-neutral-300 font-medium italic">
                    "{entry.promise || 'No reflection recorded for this day.'}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.completedHabits.map(h => (
                    <span key={h} className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-bold text-neutral-400 uppercase">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 bg-[#0a0a0a] border border-neutral-900 border-dashed rounded-[2rem]">
            <BookText className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-500">Your journal is currently empty.</h3>
            <p className="text-neutral-600 mt-2 max-w-xs mx-auto">Seal your first promise today to begin building your database.</p>
          </div>
        )}
      </div>
    </div>
  );
};
