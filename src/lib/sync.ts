import { 
  doc, setDoc, getDoc, collection, query, 
  orderBy, limit, onSnapshot, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { FeedEvent } from '../types';

/**
 * Migration & Sync Logic for SMASH FIND
 */

// Save current user state to Firestore
export const saveUserDataToFirestore = async (uid: string, data: any) => {
  if (!uid || !data) return;
  try {
    const userRef = doc(db, 'users', uid);
    
    // Create a deep copy and sanitize
    const cleanData = JSON.parse(JSON.stringify(data));
    
    // Explicitly define the fields we want to persist to avoid accidental bloat or UI state leaks
    const persistentData = {
      selectedDisciplines: cleanData.selectedDisciplines || [],
      habits: cleanData.habits || [],
      criticalPath: cleanData.criticalPath || [],
      waterIntake: cleanData.waterIntake || 0,
      steps: cleanData.steps || 0,
      calories: cleanData.calories || 0,
      weight: cleanData.weight || 0,
      targetWeight: cleanData.targetWeight || 75,
      height: cleanData.height || 0,
      age: cleanData.age || 0,
      gender: cleanData.gender || '',
      sleepHours: cleanData.sleepHours || 0,
      sleepQuality: cleanData.sleepQuality || 0,
      focusSessions: cleanData.focusSessions || 0,
      streak: cleanData.streak || 0,
      lastActive: cleanData.lastActive || new Date().toISOString(),
      isPro: cleanData.isPro ?? true,
      score: cleanData.score || 0,
      level: cleanData.level || 1,
      xp: cleanData.xp || 0,
      tier: cleanData.tier || 'Bronze',
      theme: cleanData.theme || 'dark',
      accentColor: cleanData.accentColor || '#10b981',
      dailyHistory: cleanData.dailyHistory || {},
      visionBoard: cleanData.visionBoard || [],
      notificationSettings: cleanData.notificationSettings || {},
      onboardingCompleted: cleanData.onboardingCompleted ?? false,
      displayName: data.auth?.name || data.displayName || 'Warrior',
      avatar: data.auth?.avatar || data.avatar || '👤',
      uid: uid,
      updatedAt: serverTimestamp()
    };

    // Use setDoc with merge: true to ensure we never overwrite fields that might be updated elsewhere
    await setDoc(userRef, persistentData, { merge: true });
    
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Firestore Security: Permission denied. Check rules.');
    } else {
      console.error('Firestore Save Error:', error.message);
    }
  }
};

// Broadcast event to global protocol feed
export const broadcastProtocolEvent = async (event: Omit<FeedEvent, 'id' | 'timestamp'>) => {
  try {
    const feedRef = collection(db, 'protocol_feed');
    await addDoc(feedRef, {
      ...event,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Firestore: Error broadcasting event', error);
  }
};

// Subscribe to leaderboard updates
export const subscribeToLeaderboard = (callback: (data: any[]) => void) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('score', 'desc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const leaders = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    }));
    callback(leaders);
  });
};

// Subscribe to global feed updates
export const subscribeToGlobalFeed = (callback: (data: FeedEvent[]) => void) => {
  const feedRef = collection(db, 'protocol_feed');
  const q = query(feedRef, orderBy('timestamp', 'desc'), limit(20));
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
    } as FeedEvent));
    callback(events);
  });
};

// Load user data from Firestore
export const loadUserDataFromFirestore = async (uid: string) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Firestore: Error loading data', error);
    return null;
  }
};

// Elite Mock Bots with fresh names
const MOCK_BOTS = [
  { id: 'bot-1', displayName: 'Stoic_Actual', score: 98.8, level: 45, tier: 'Master', avatar: '🏛️', title: 'The Stoic Master', updatedAt: new Date().toISOString() },
  { id: 'bot-2', displayName: 'Vanguard_Commander', score: 94.2, level: 40, tier: 'Master', avatar: '🛡️', title: 'The Elite', updatedAt: new Date().toISOString() },
  { id: 'bot-3', displayName: 'Apex_Protocol', score: 89.5, level: 35, tier: 'Ace', avatar: '⚡', title: 'The Elite', updatedAt: new Date().toISOString() },
  { id: 'bot-4', displayName: 'Nova_Prime', score: 86.1, level: 32, tier: 'Ace', avatar: '🧠', title: 'The Elite', updatedAt: new Date().toISOString() },
  { id: 'bot-5', displayName: 'Zenith_Warrior', score: 82.3, level: 28, tier: 'Platinum', avatar: '⚔️', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-6', displayName: 'Titan_Discipline', score: 78.4, level: 25, tier: 'Platinum', avatar: '🔱', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-7', displayName: 'Ghost_Operative', score: 75.1, level: 22, tier: 'Gold', avatar: '🥷', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-8', displayName: 'Neon_Stoic', score: 71.5, level: 20, tier: 'Gold', avatar: '⚡', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-9', displayName: 'Shadow_Commander', score: 68.9, level: 18, tier: 'Gold', avatar: '🦅', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-10', displayName: 'Iron_Mindset', score: 64.2, level: 16, tier: 'Silver', avatar: '⛓️', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-11', displayName: 'Atlas_One', score: 59.7, level: 14, tier: 'Silver', avatar: '🌎', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-12', displayName: 'Kratos_System', score: 54.1, level: 12, tier: 'Silver', avatar: '🏛️', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-13', displayName: 'Primal_Echo', score: 48.6, level: 10, tier: 'Bronze', avatar: '🐺', title: 'The Drifter', updatedAt: new Date().toISOString() },
  { id: 'bot-14', displayName: 'Static_Aura', score: 42.3, level: 8, tier: 'Bronze', avatar: '✨', title: 'The Drifter', updatedAt: new Date().toISOString() },
  { id: 'bot-15', displayName: 'Void_Seeker', score: 35.5, level: 5, tier: 'Bronze', avatar: '🌑', title: 'The Drifter', updatedAt: new Date().toISOString() }
];

// Mock Feed actions for bots
const BOT_ACTIONS = [
  "completed a 4-hour Deep Work session",
  "sealed the Daily Promise Ritual",
  "reached a new discipline level",
  "established a 10-day streak",
  "optimized their metabolic engine",
  "hit a new personal record in steps",
  "completed the Morning Protocol",
  "attained a new identity tier"
];

/**
 * Unified Global Ranking System
 * Listens to the 'users' collection where real users reside.
 * Merges with elite bots and sorts by score to ensure competitive hierarchy.
 */
export const syncLeaderboard = (callback: (data: any[]) => void) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('score', 'desc'), limit(50));
    
    return onSnapshot(q, (snapshot) => {
      // 1. Get real users from Firestore
      const realUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.id,
        ...(doc.data() as any)
      }));
      
      // 2. Filter MOCK_BOTS to remove any that might conflict with real user names
      const realNames = new Set(realUsers.map(u => u.displayName));
      const filteredBots = MOCK_BOTS.filter(bot => !realNames.has(bot.displayName));
      
      // 3. Merge real users and bots, then sort by score descending
      const combined = [...realUsers, ...filteredBots]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 50); // Keep top 50 in global hierarchy
        
      callback(combined);
    }, (error: any) => {
      if (error.code === 'failed-precondition') {
        console.error("Firestore Index Required: https://console.firebase.google.com/project/discipline-tracker-ee454/firestore/indexes");
      } else {
        console.error("Global Ranking Sync Error:", error.message);
      }
      callback(MOCK_BOTS);
    });
  } catch (error) {
    console.error("Failed to initialize Global Ranking Sync:", error);
    callback(MOCK_BOTS);
  }
};

/**
 * Real-time User Feed Logic
 * Combined Real Actions with Mock Social Activity
 */
export const syncUserFeed = (callback: (data: any[]) => void) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('updatedAt', 'desc'), limit(10));

    return onSnapshot(q, (snapshot) => {
      const realUsers = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        uid: doc.id,
        ...(doc.data() as any)
      }));

      // Generate some recent bot actions to fill the feed
      const botFeedItems = MOCK_BOTS.slice(0, 8).map((bot, i) => ({
        ...bot,
        id: `bot-action-${i}`,
        type: 'achievement',
        content: BOT_ACTIONS[Math.floor(Math.random() * BOT_ACTIONS.length)],
        timestamp: new Date(Date.now() - (i * 1000 * 60 * 15)).toISOString() // Staggered timestamps
      }));

      const combinedFeed = [...realUsers.map(u => ({
        ...u,
        type: 'achievement',
        content: `at Level ${u.level || 1} with ${u.score || 0} XP`,
        timestamp: u.updatedAt ? (typeof u.updatedAt.toDate === 'function' ? u.updatedAt.toDate().toISOString() : u.updatedAt) : new Date().toISOString()
      })), ...botFeedItems]
        .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
        .slice(0, 10);

      callback(combinedFeed);
    }, (error: any) => {
      console.error("Firebase Sync Error (User Feed):", error.message);
      // Fallback to bot feed
      const botFeedItems = MOCK_BOTS.slice(0, 10).map((bot, i) => ({
        ...bot,
        id: `bot-action-${i}`,
        type: 'achievement',
        content: BOT_ACTIONS[Math.floor(Math.random() * BOT_ACTIONS.length)],
        timestamp: new Date(Date.now() - (i * 1000 * 60 * 15)).toISOString()
      }));
      callback(botFeedItems);
    });
  } catch (error) {
    console.error("Failed to initialize User Feed Sync:", error);
    callback([]);
  }
};

// Get specific field (e.g., for analytics or leaderboard)
export const getUserStats = async (uid: string) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};
