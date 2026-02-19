import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { AuthData } from '../types';
import { logIn, signUp, signInWithGoogle } from '../lib/auth';

interface Props {
  onAuth: (data: AuthData) => void;
}

export const Auth: React.FC<Props> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*]/.test(pass);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Password must include at least one uppercase letter.";
    if (!hasLower) return "Password must include at least one lowercase letter.";
    if (!hasNumber) return "Password must include at least one number.";
    if (!hasSpecial) return "Password must include at least one special character (!@#$%^&*).";

    return null;
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { user, error } = await signInWithGoogle();
    if (user) {
      onAuth({ 
        uid: user.uid, 
        email: user.email || '', 
        name: user.displayName || 'Warrior' 
      });
      setLoading(false);
    } else if (error === 'REDIRECTING') {
      // Page will redirect, don't stop loading spinner
    } else if (error) {
      alert(`Google Sign-In Error: ${error}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isLogin) {
      const validationError = validatePassword(password);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    
    if (isLogin) {
      const { user, error: loginError } = await logIn(email, password);
      if (user) {
        onAuth({ 
          uid: user.uid, 
          email: user.email || '', 
          name: user.displayName || email.split('@')[0] 
        });
      } else {
        setError(loginError || "Invalid credentials.");
        setLoading(false);
      }
    } else {
      const { user, error: signupError } = await signUp(email, password, name);
      if (user) {
        onAuth({ 
          uid: user.uid, 
          email: user.email || '', 
          name: name || email.split('@')[0] 
        });
      } else {
        setError(signupError || "Signup failed.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#10b981] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Zap className="w-8 h-8 text-black" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter mb-2 uppercase">SMASH</h1>
          <p className="text-[#10b981] font-bold uppercase text-[10px] tracking-[0.4em]">Protocol Elite System</p>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex bg-neutral-900 rounded-2xl p-1 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs font-bold text-rose-500 flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#10b981] outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:border-[#10b981] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-[#10b981] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0da975] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Enter System' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-900"></div></div>
                <div className="relative flex justify-center text-[8px] uppercase font-bold text-neutral-600"><span className="bg-[#0a0a0a] px-2">OR PROTOCOL AUTH</span></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all border border-neutral-800 disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" className="w-4 h-4" />
                Sign in with Google
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#10b981]/50" />
            End-to-End Encrypted Access
          </div>
        </div>

        <p className="mt-8 text-center text-neutral-600 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
          By entering, you commit to the pursuit of absolute discipline.
        </p>
      </motion.div>
    </div>
  );
};
