import { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useStepTracker = (userId: string | undefined) => {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const lastUpdate = useRef<number>(0);
  const threshold = 12; // Adjusted threshold for peak detection
  const cooldown = 300; // ms between steps
  const lastStepTime = useRef<number>(0);

  // Load initial steps from Firebase
  useEffect(() => {
    const loadSteps = async () => {
      if (!userId) return;
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSteps(docSnap.data().dailySteps || 0);
        }
      } catch (error) {
        console.error("Error loading steps:", error);
      }
    };
    loadSteps();
  }, [userId]);

  // Sync steps to Firebase (Throttled)
  useEffect(() => {
    const syncSteps = async () => {
      if (!userId || steps === 0) return;
      const now = Date.now();
      if (now - lastUpdate.current > 5000) { // Sync every 5 seconds
        try {
          const docRef = doc(db, 'users', userId);
          await updateDoc(docRef, { dailySteps: steps }).catch(async (err) => {
            // If doc doesn't exist, create it
            if (err.code === 'not-found') {
              await setDoc(docRef, { dailySteps: steps }, { merge: true });
            }
          });
          lastUpdate.current = now;
        } catch (error) {
          console.error("Error syncing steps:", error);
        }
      }
    };
    syncSteps();
  }, [steps, userId]);

  const startTracking = async () => {
    // iOS Permission Request
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          alert("Permission to access motion sensors was denied.");
          return;
        }
      } catch (error) {
        console.error("Permission request failed:", error);
      }
    }

    setIsTracking(true);
    window.addEventListener('devicemotion', handleMotion);
  };

  const stopTracking = () => {
    setIsTracking(false);
    window.removeEventListener('devicemotion', handleMotion);
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      (acc.x || 0) ** 2 + 
      (acc.y || 0) ** 2 + 
      (acc.z || 0) ** 2
    );

    const now = Date.now();
    if (magnitude > threshold && now - lastStepTime.current > cooldown) {
      setSteps(prev => prev + 1);
      lastStepTime.current = now;
    }
  };

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return { steps, isTracking, startTracking, stopTracking };
};
