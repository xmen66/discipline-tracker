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
      sleepHours: cleanData.sleepHours || 0,
      sleepQuality: cleanData.sleepQuality || 0,
      focusSessions: cleanData.focusSessions || 0,
      streak: cleanData.streak || 0,
      lastActive: cleanData.lastActive || new Date().toISOString(),
      score: cleanData.score || 0,
      level: cleanData.level || 1,
      xp: cleanData.xp || 0,
      tier: cleanData.tier || 'Bronze',
      theme: cleanData.theme || 'dark',
      accentColor: cleanData.accentColor || '#10b981',
      dailyHistory: cleanData.dailyHistory || {},
      notificationSettings: cleanData.notificationSettings || {},
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
      // console.log('Firestore: Data retrieved for user', uid);
      return docSnap.data();
    } else {
      // console.log('Firestore: No remote data found for user', uid);
      return null;
    }
  } catch (error) {
    console.error('Firestore: Error loading data', error);
    return null;
  }
};

// Expanded Mock Bots for a thriving community look
const MOCK_BOTS = [
  { id: 'bot-1', displayName: 'Marcus_Aurelius', score: 98.5, level: 42, tier: 'Master', avatar: '🏛️', title: 'The Stoic Master', updatedAt: new Date().toISOString() },
  { id: 'bot-2', displayName: 'Stoic_Warrior', score: 94.2, level: 38, tier: 'Ace', avatar: '🛡️', title: 'The Elite', updatedAt: new Date().toISOString() },
  { id: 'bot-3', displayName: 'Deep_Focus_99', score: 89.1, level: 31, tier: 'Platinum', avatar: '🧠', title: 'The Elite', updatedAt: new Date().toISOString() },
  { id: 'bot-4', displayName: 'Vanguard_Elite', score: 85.7, level: 25, tier: 'Platinum', avatar: '⚔️', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-5', displayName: 'Zen_Commander', score: 82.3, level: 22, tier: 'Gold', avatar: '🧘', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-6', displayName: 'Titan_Discipline', score: 79.8, level: 19, tier: 'Gold', avatar: '🔱', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-7', displayName: 'Ares_Protocol', score: 76.4, level: 16, tier: 'Gold', avatar: '🦅', title: 'The Warrior', updatedAt: new Date().toISOString() },
  { id: 'bot-8', displayName: 'Sensei_Flow', score: 72.1, level: 14, tier: 'Silver', avatar: '🥋', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-9', displayName: 'Shadow_Stalker', score: 68.5, level: 12, tier: 'Silver', avatar: '🥷', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-10', displayName: 'Iron_Mind', score: 64.2, level: 11, tier: 'Silver', avatar: '⛓️', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-11', displayName: 'Atlas_Rising', score: 61.9, level: 10, tier: 'Silver', avatar: '🌎', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-12', displayName: 'Nova_Discipline', score: 58.4, level: 9, tier: 'Bronze', avatar: '✨', title: 'The Seeker', updatedAt: new Date().toISOString() },
  { id: 'bot-13', displayName: 'Ghost_Protocol', score: 54.7, level: 7, tier: 'Bronze', avatar: '👻', title: 'The Drifter', updatedAt: new Date().toISOString() },
  { id: 'bot-14', displayName: 'Primal_Force', score: 49.2, level: 5, tier: 'Bronze', avatar: '🐺', title: 'The Drifter', updatedAt: new Date().toISOString() },
  { id: 'bot-15', displayName: 'Static_Void', score: 42.1, level: 3, tier: 'Bronze', avatar: '🌑', title: 'The Drifter', updatedAt: new Date().toISOString() }
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
 * Real-time Leaderboard Logic
 * Combined Real Users with Mock Bots
 */
export const syncLeaderboard = (callback: (data: any[]) => void) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('score', 'desc'), limit(15));

    return onSnapshot(q, (snapshot) => {
      const realUsers = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        uid: doc.id,
        ...doc.data() 
      })) as any[];
      
      // Merge real users with bots
      // If a real user has the same score as a bot, real user stays
      const combined = [...realUsers];
      
      // Add bots that aren't already represented by real users
      MOCK_BOTS.forEach(bot => {
        if (!combined.some(u => u.displayName === bot.displayName)) {
          combined.push(bot);
        }
      });

      const finalLeaderboard = combined
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 15);

      callback(finalLeaderboard);
    }, (error: any) => {
      console.error("Firebase Sync Error (Leaderboard):", error.message);
      // If Firestore is empty or fails, still return bots
      callback(MOCK_BOTS);
    });
  } catch (error) {
    console.error("Failed to initialize Leaderboard Sync:", error);
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
        ...doc.data() 
      })) as any[];

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
