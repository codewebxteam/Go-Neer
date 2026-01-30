import { useState, useEffect } from "react";
import { onAuthChange, signUp, signIn, signOut } from "../services/authService";

// Hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      setError(null);
      const result = await signUp(email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signIn(email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { user, loading, error, signup, login, logout };
};
