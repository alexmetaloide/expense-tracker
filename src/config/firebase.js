import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCH2wk6V7hDzVsZEaepX-m-2DciMYaHAGs",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "banco-dados-tv.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "banco-dados-tv",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "banco-dados-tv.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "295405312917",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:295405312917:web:1ac198b4c1fb8a12b4349c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
