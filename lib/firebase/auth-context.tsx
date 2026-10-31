"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";

import { auth, isAdminUid } from "@/lib/firebase/client";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value: AuthState = {
    user,
    isAdmin: isAdminUid(user?.uid),
    loading,
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
