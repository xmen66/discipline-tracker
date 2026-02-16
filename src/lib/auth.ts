import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Log in an existing user with email and password
 */
export const logIn = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Log in using Google Popup with Redirect Fallback
 */
export const signInWithGoogle = async () => {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    // If popup is blocked or fails, try redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      try {
        await signInWithRedirect(auth, googleProvider);
        // This will redirect the page, so we don't return anything here.
        // App.tsx needs to handle getRedirectResult
        return { user: null, error: 'REDIRECTING' };
      } catch (redirError: any) {
        return { user: null, error: redirError.message };
      }
    }
    return { user: null, error: error.message };
  }
};

/**
 * Handle redirect result after sign in
 */
export const handleSignInRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    return { user: result?.user || null, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Log out the current user
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Listen for auth state changes
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
