import { useState, useEffect, useCallback } from 'react';
import { IdentityOnboarding } from './components/IdentityOnboarding';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { VisionBoard } from './components/VisionBoard';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { Sidebar, BottomNav, View } from './components/Navigation';
import { DownloadModal } from './components/DownloadModal';
import { Auth } from './components/Auth';
import { UserState, Habit, DailyHistoryEntry, NotificationSettings } from './types';
import { ALL_DISCIPLINES } from './data/disciplines';
import { DisciplineEngine } from './utils/DisciplineEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';
import { subscribeToAuthChanges, logOut, handleSignInRedirect } from './lib/auth';

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: false,
  morningTime: "08:00",
  eveningTime: "20:00",
  reminderInterval: 60
};

export function App() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  useEffect(() => {
    // Check for redirect result on mount
    handleSignInRedirect().then(({ error }) => {
      if (error) console.error("Redirect Auth Error:", error);
    });

    // Firebase Auth State Listener
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        const saved = localStorage.getItem(`smash_user_data_${email}`);
        
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Ensure compatibility with latest version state
            setUserState({
              ...parsed,
              auth: { email, name: firebaseUser.displayName || parsed.auth?.name || email.split('@')[0] }
            });
          } catch (e) {
            console.error("Failed to load state", e);
          }
        } else {
          // Initialize new user
          setUserState({
            auth: { email, name: firebaseUser.displayName || email.split('@')[0] },
            identity: [],
            habits: [],
            criticalPath: [],
            waterIntake: 0,
            steps: 0,
            calories: 0,
            weight: 0,
            targetWeight: 75,
            sleepHours: 0,
            sleepQuality: 0,
            focusSessions: 0,
            streak: 0,
            lastActive: new Date().toISOString(),
            isPro: true,
            score: 0,
            theme: 'dark',
            accentColor: '#10b981',
            dailyHistory: {},
            notificationSettings: DEFAULT_NOTIFICATIONS
          });
        }
      } else {
        setUserState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Theme effect
  useEffect(() => {
    if (userState?.theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(userState.theme);
      
      // Inject custom color variable
      document.documentElement.style.setProperty('--accent-color', userState.accentColor);
      
      // Update body background
      if (userState.theme === 'light') {
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
      } else {
        document.body.style.backgroundColor = '#050505';
        document.body.style.color = 'white';
      }
    }
  }, [userState?.theme, userState?.accentColor]);

  // Browser Notification Simulation
  useEffect(() => {
    if (userState?.notificationSettings.enabled) {
      const interval = setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (currentTime === userState.notificationSettings.morningTime) {
          new Notification("SMASH Identity Brief", { body: "Review your disciplines for today." });
        }
        if (currentTime === userState.notificationSettings.eveningTime) {
          new Notification("SMASH Daily Promise", { body: "Time to reflect on your progress." });
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [userState?.notificationSettings]);

  const saveState = useCallback((newState: UserState) => {
    setUserState(newState);
    if (newState.auth?.email) {
      localStorage.setItem(`smash_user_data_${newState.auth.email}`, JSON.stringify(newState));
    }
  }, []);

  const handleOnboardingComplete = (selectedIds: string[]) => {
    if (!userState) return;

    const habits: Habit[] = selectedIds.map(id => {
      const base = ALL_DISCIPLINES.find(d => d.id === id);
      return {
        id,
        name: base?.name || id,
        category: (base?.category as any) || 'Physical',
        completed: false,
        streak: 0
      };
    });

    const newState: UserState = {
      ...userState,
      identity: selectedIds,
      habits,
      criticalPath: [],
      waterIntake: 0,
      steps: 0,
      calories: 0,
      weight: 0,
      targetWeight: 75,
      streak: 0,
      lastActive: new Date().toISOString(),
      isPro: true, 
      score: 0,
      theme: 'dark',
      accentColor: '#10b981',
      dailyHistory: {},
      notificationSettings: DEFAULT_NOTIFICATIONS
    };

    saveState(newState);
  };

  const handleLogout = async () => {
    await logOut();
    setActiveView('dashboard');
  };

  const handleDeleteData = () => {
    if (userState?.auth?.email && confirm("Permanently destroy all system data for this account?")) {
      localStorage.removeItem(`smash_user_data_${userState.auth.email}`);
      handleLogout();
    }
  };

  const updateState = (updater: (prev: UserState) => UserState) => {
    if (!userState) return;
    const newState = updater(userState);
    saveState(newState);
  };

  const sealDailyPromise = (promise: string) => {
    if (!userState) return;
    
    const score = DisciplineEngine.calculateScore(userState);
    const dateKey = new Date().toISOString().split('T')[0];
    
    const entry: DailyHistoryEntry = {
      score,
      completedHabits: userState.habits.filter(h => h.completed).map(h => h.name),
      waterIntake: userState.waterIntake,
      steps: userState.steps,
      calories: userState.calories,
      weight: userState.weight,
      promise
    };

    updateState(prev => ({
      ...prev,
      streak: score >= 80 ? prev.streak + 1 : 0,
      dailyHistory: {
        ...prev.dailyHistory,
        [dateKey]: entry
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userState) {
    return (
      <div className="min-h-screen font-sans">
        <Auth onAuth={() => {
          // Firebase observer in useEffect will handle the state update automatically
          // but we can set loading to true to show a transition if needed
          setLoading(true);
        }} />
      </div>
    );
  }

  if (userState.identity.length === 0) {
    return (
      <div className="min-h-screen font-sans">
        <IdentityOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard state={userState} onStateUpdate={saveState} onSealPromise={sealDailyPromise} onLogout={handleLogout} />;
      case 'analytics':
        return <Dashboard state={userState} onStateUpdate={saveState} onSealPromise={sealDailyPromise} onLogout={handleLogout} showOnlyStats />;
      case 'journal':
        return <Journal state={userState} />;
      case 'vision':
        return <VisionBoard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'settings':
        return <Settings state={userState} onLogout={handleLogout} onDeleteData={handleDeleteData} onStateUpdate={saveState} />;
      default:
        return <Dashboard state={userState} onStateUpdate={saveState} onSealPromise={sealDailyPromise} onLogout={handleLogout} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen font-sans flex transition-colors duration-300",
      userState.theme === 'light' ? "bg-slate-50 text-slate-900" : "bg-[#050505] text-white"
    )}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onDownloadClick={() => setIsDownloadOpen(true)}
        theme={userState.theme}
      />
      
      <main className="flex-1 md:ml-64 p-4 md:p-12 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onDownloadClick={() => setIsDownloadOpen(true)}
        theme={userState.theme}
      />

      <DownloadModal 
        isOpen={isDownloadOpen} 
        onClose={() => setIsDownloadOpen(false)} 
      />
    </div>
  );
}
