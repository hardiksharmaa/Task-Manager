"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/tasks"); 
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">
          Task Manager
        </h1>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}