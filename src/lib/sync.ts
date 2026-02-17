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
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    
    // Clean data to avoid nested object issues or recursive refs
    const cleanData = { ...data };
    if (cleanData.auth) delete cleanData.auth; // Don't sync auth info back to doc root redundantly

    await setDoc(userRef, {
      ...cleanData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Firestore: Error saving data', error);
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

// Get specific field (e.g., for analytics or leaderboard)
export const getUserStats = async (uid: string) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};
