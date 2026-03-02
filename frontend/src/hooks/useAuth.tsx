"use client";

import { createContext, useContext, useEffect } from "react";
import api, { setAccessToken } from "@/lib/api";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
      } catch {
        setAccessToken(null);
      }
    };

    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
  };

  const register = async (email: string, password: string, name?: string) => {
    await api.post("/auth/register", { email, password, name });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};