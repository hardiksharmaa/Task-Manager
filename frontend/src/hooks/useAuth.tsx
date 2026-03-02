"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/lib/api";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
        setIsAuthenticated(true);
      } catch {
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name?: string) => {
    await api.post("/auth/register", { email, password, name });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};