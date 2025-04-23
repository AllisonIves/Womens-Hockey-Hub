import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Firebase configuration object using Vite environment variables.
 * These values are injected at build time.
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

/**
 * Initializes Firebase app with the provided config.
 * Required before any Firebase services can be used.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 * Used for managing user login sessions across the app.
 */
const auth = getAuth(app);

/**
 * GoogleAuthProvider instance.
 * Used to enable Google Sign-In via Firebase.
 */
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
