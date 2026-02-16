import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-medium text-slate-600">Now showing live preview</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
            Build Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Web Experiences</span> Faster
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create lightning-fast, modern websites with React, Vite, and Tailwind CSS. Seamlessly preview your changes in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group transition-all">
              Launch Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-semibold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
              Watch Demo
              <Play className="w-5 h-5 text-indigo-600" />
            </button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-6 md:gap-12">
            {['Fast Performance', 'Modern UI/UX', 'SEO Optimized'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
