import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyByi6asZHPHq92jIKl-28kUSSnolNzreD4",
    authDomain: "go-neer-68891.firebaseapp.com",
    projectId: "go-neer-68891",
    storageBucket: "go-neer-68891.firebasestorage.app",
    messagingSenderId: "237942100490",
    appId: "1:237942100490:web:c019861fcb4a0bb10485f3",
    measurementId: "G-J5HTM6JVXT"
};

console.log("🔥 FIREBASE API KEY IN USE:", firebaseConfig.apiKey);

const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined" && import.meta.env.PROD) {
    analytics = getAnalytics(app);
}
export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
