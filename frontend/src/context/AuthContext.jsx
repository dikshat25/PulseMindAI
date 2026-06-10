import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login for when dummy keys are used
  const mockLogin = (email) => {
    setCurrentUser({ uid: 'mock_uid_123', email, displayName: email.split('@')[0] });
  };

  const signup = async (email, password, name) => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      mockLogin(email);
      return Promise.resolve();
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      mockLogin(email);
      return Promise.resolve();
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  const resetPassword = (email) => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      return Promise.resolve();
    }
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName) => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      setCurrentUser(prev => ({ ...prev, displayName }));
      return Promise.resolve();
    }
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      setCurrentUser({ ...auth.currentUser });
    }
  };

  useEffect(() => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key') {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
