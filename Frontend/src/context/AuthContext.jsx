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
  const [user, setUser] = useState(null); // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore profile
  const [loading, setLoading] = useState(true);

  // 🔁 Load profile by role
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

  // 🔄 Monitor Auth State
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

  // 🔐 LOGIN
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

  // 🆕 SIGNUP
  const signup = async ({
    email,
    password,
    fullName,
    phone,
    role,
    extraData = {},
  }) => {
    try {
      setLoading(true);

      if (!email || !password || !fullName || !phone || !role) {
        throw new Error("All signup fields are required");
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: fullName });

      const collectionName = role === "vendor" ? "vendors" : "users";

      const profileData = {
        id: res.user.uid,
        email,
        full_name: fullName,
        phone,
        role,

        // 🔥 DEFAULT SYSTEM FIELDS
        rating: 0.5,
        is_active: true,

        created_at: serverTimestamp(),
        ...extraData,
      };

      await setDoc(doc(db, collectionName, res.user.uid), profileData);

      setUser(res.user);
      setProfile(profileData);

      return { user: res.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
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

  // ⏳ Loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-3" />
        <p className="text-slate-400 text-sm">Checking authentication...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
