import React from 'react';
import { Menu, X, Layout } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 italic">SMASH FIND</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <a href="#features" className="hover:text-[#10b981] transition-colors">Protocol</a>
          <a href="#mission" className="hover:text-[#10b981] transition-colors">Mission</a>
          <a href="#performance" className="hover:text-[#10b981] transition-colors">Performance</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))}
            className="px-6 py-2 text-xs font-black text-slate-900 uppercase tracking-widest hover:text-[#10b981] transition-colors"
          >
            Access System
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))}
            className="px-6 py-2 text-xs font-black text-white bg-black hover:bg-[#10b981] rounded-full shadow-xl transition-all uppercase tracking-widest"
          >
            Join Elite
          </button>
        </div>

        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <a href="#features" className="text-slate-600 py-2">Features</a>
          <a href="#solutions" className="text-slate-600 py-2">Solutions</a>
          <a href="#pricing" className="text-slate-600 py-2">Pricing</a>
          <button className="w-full py-3 text-slate-700 border border-slate-200 rounded-lg">Log in</button>
          <button className="w-full py-3 text-white bg-indigo-600 rounded-lg">Get Started</button>
        </div>
      )}
    </header>
  );
};
