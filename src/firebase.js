import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// Make sure to add these to a .env config file like:
// VITE_FIREBASE_API_KEY=your_key_here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SETUP_REQUIRED",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "SETUP_REQUIRED",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "SETUP_REQUIRED",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "SETUP_REQUIRED",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "SETUP_REQUIRED",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "SETUP_REQUIRED"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
