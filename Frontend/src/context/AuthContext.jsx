import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile by role
  const loadUserProfile = async (uid) => {
    const collections = ["users", "vendors"];
    for (const col of collections) {
      const ref = doc(db, col, uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile({ id: uid, ...snap.data() });
        return;
      }
    }
    setProfile(null);
  };

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      await loadUserProfile(res.user.uid);
      return { user: res.user, error: null };
    } catch (error) {
      console.error("Login failed:", error);
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP - Only handles Firebase Auth + base user document
  const signup = async ({ email, password, fullName, phone, role }) => {
    try {
      setLoading(true);

      if (!email || !password || !fullName || !phone || !role) {
        throw new Error("All signup fields are required");
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: fullName });

      // Create base user document in "users" collection for ALL roles
      const userData = {
        id: res.user.uid,
        email,
        full_name: fullName,
        phone,
        role,
        created_at: serverTimestamp(),
      };

      await setDoc(doc(db, "users", res.user.uid), userData);

      setUser(res.user);
      setProfile(userData);

      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const value = { user, profile, loading, login, signup, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
