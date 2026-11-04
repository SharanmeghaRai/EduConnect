import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginDemo: (type: 'student' | 'admin') => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<any>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    department?: string;
    rollNumber?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isOnboardingRequired: boolean;
  completeOnboarding: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (api.getToken()) {
        const res = await api.auth.me();
        setUser(res.user);
      } else {
        // Auto-login with student demo account if completely new session for zero-friction exploration
        const res = await api.auth.demoLogin('student');
        api.setToken(res.accessToken);
        setUser(res.user);
      }
    } catch {
      api.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loginWithGoogle = async (credential: string) => {
    setLoading(true);
    try {
      const res = await api.auth.google(credential);
      api.setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (type: 'student' | 'admin') => {
    setLoading(true);
    try {
      const res = await api.auth.demoLogin(type);
      api.setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      api.setToken(res.accessToken);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    department?: string;
    rollNumber?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.auth.register(data);
      api.setToken(res.accessToken);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      api.setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const res = await api.auth.me();
    setUser(res.user);
  };

  const completeOnboarding = async (data: any) => {
    await api.students.onboarding(data);
    await refreshUser();
  };

  const isOnboardingRequired = Boolean(
    user &&
      user.role === 'STUDENT' &&
      (!user.studentProfile || !user.studentProfile.rollNumber)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginDemo,
        loginWithEmail,
        registerWithEmail,
        logout,
        refreshUser,
        isOnboardingRequired,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
