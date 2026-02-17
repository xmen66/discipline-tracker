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
import { Zap } from 'lucide-react';
import { subscribeToAuthChanges, logOut, handleSignInRedirect } from './lib/auth';
import { saveUserDataToFirestore, loadUserDataFromFirestore, broadcastProtocolEvent } from './lib/sync';

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
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || '';
        const uid = firebaseUser.uid;
        
        // 1. Try to load from Firestore first for device sync
        const remoteData = await loadUserDataFromFirestore(uid);
        
        // 2. Fallback to localStorage if no Firestore data
        const savedLocal = localStorage.getItem(`smash_user_data_${email}`);
        
        if (remoteData) {
          // Sync found - merge and use
          const avatar = (remoteData as any).avatar || (remoteData as any).auth?.avatar || '👤';
          setUserState({
            ...remoteData as any,
            auth: { 
              uid, 
              email, 
              name: (remoteData as any).displayName || firebaseUser.displayName || (remoteData as any).auth?.name || email.split('@')[0],
              avatar: avatar
            }
          });
          
          // Update local cache
          localStorage.setItem(`smash_user_data_${email}`, JSON.stringify(remoteData));
        } else if (savedLocal) {
          try {
            const parsed = JSON.parse(savedLocal);
            const newState = {
              ...parsed,
              auth: { uid, email, name: firebaseUser.displayName || parsed.auth?.name || email.split('@')[0] }
            };
            setUserState(newState);
            // Migrate local to Firestore
            await saveUserDataToFirestore(uid, newState);
          } catch (e) {
            console.error("Failed to load local state", e);
          }
        } else {
          // Initialize new user
          const newUserState: UserState = {
            auth: { 
              uid, 
              email, 
              name: firebaseUser.displayName || email.split('@')[0], 
              avatar: '⚡',
              level: 1,
              xp: 0,
              tier: 'Bronze'
            },
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
            level: 1,
            xp: 0,
            tier: 'Bronze',
            theme: 'dark',
            accentColor: '#10b981',
            dailyHistory: {},
            notificationSettings: DEFAULT_NOTIFICATIONS
          };
          setUserState(newUserState);
          await saveUserDataToFirestore(uid, newUserState);
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
    const score = DisciplineEngine.calculateScore(newState);
    
    // Level & XP Logic
    // XP is earned based on score and streak multiplier
    // Only add XP if score > 0 and it's a new interaction (simplified for now to recalculate on changes)
    // In a real app, you'd only add XP on "completions" or daily seals
    // Here we'll simulate XP growth based on score
    
    let xp = newState.xp;
    let level = newState.level;
    let tier = newState.tier;
    
    // Dynamic Level Calculation
    level = Math.floor(Math.sqrt(xp / 100)) + 1;
    
    const getTier = (l: number): UserState['tier'] => {
      if (l >= 80) return 'Master';
      if (l >= 60) return 'Ace';
      if (l >= 40) return 'Platinum';
      if (l >= 25) return 'Gold';
      if (l >= 10) return 'Silver';
      return 'Bronze';
    };
    
    tier = getTier(level);

    const finalState: UserState = { 
      ...newState, 
      score,
      level,
      tier,
      auth: newState.auth ? {
        ...newState.auth,
        level,
        tier,
        xp
      } : undefined
    };
    
    setUserState(finalState);
    if (finalState.auth?.email && finalState.auth?.uid) {
      localStorage.setItem(`smash_user_data_${finalState.auth.email}`, JSON.stringify(finalState));
      saveUserDataToFirestore(finalState.auth.uid, finalState);
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
    
    if (newState.auth) {
      broadcastProtocolEvent({
        userId: newState.auth.uid,
        userName: newState.auth.name,
        userAvatar: newState.auth.avatar || '👤',
        type: 'achievement',
        content: `established a new identity protocol`
      });
    }
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

    const xpGain = Math.round(score * (1 + userState.streak * 0.1));

    updateState(prev => ({
      ...prev,
      xp: prev.xp + xpGain,
      streak: score >= 80 ? prev.streak + 1 : 0,
      dailyHistory: {
        ...prev.dailyHistory,
        [dateKey]: entry
      },
    }));

    if (userState.auth) {
      broadcastProtocolEvent({
        userId: userState.auth.uid,
        userName: userState.auth.name,
        userAvatar: userState.auth.avatar || '👤',
        type: 'streak',
        content: `sealed the Daily Promise Ritual (Score: ${score})`
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full scale-150 animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#10b981] rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-bounce">
            <Zap className="w-10 h-10 text-black" fill="currentColor" />
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">SMASH FIND</h1>
            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-full bg-[#10b981]"
                />
              </div>
              <p className="text-[#10b981] font-bold uppercase text-[10px] tracking-[0.4em] animate-pulse">Initializing Protocol</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userState) {
    return (
      <div className="min-h-screen font-sans bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Auth onAuth={() => setLoading(true)} />
        </div>
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
        return <Leaderboard currentUserId={userState.auth?.uid} />;
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
        user={userState.auth}
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
        user={userState.auth}
      />

      <DownloadModal 
        isOpen={isDownloadOpen} 
        onClose={() => setIsDownloadOpen(false)} 
      />
    </div>
  );
}
