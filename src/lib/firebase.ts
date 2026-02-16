import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBno2rzJZsKDwP0T_vrtXS-Fl1bBDDmZXY",
  authDomain: "discipline-tracker-ee454.firebaseapp.com",
  projectId: "discipline-tracker-ee454",
  storageBucket: "discipline-tracker-ee454.firebasestorage.app",
  messagingSenderId: "833493641674",
  appId: "1:833493641674:web:5d7f0132d4c69f3a7d0733",
  measurementId: "G-KF67LZGZVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
