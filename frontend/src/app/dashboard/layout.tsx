"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, loading, isAuthenticated } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (loading || loggingOut) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!authorized) {
      setAuthorized(true);
    }
  }, [loading, isAuthenticated, loggingOut]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/dashboard.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      {!authorized ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-sm text-white/40 animate-pulse">Checking authentication...</div>
        </div>
      ) : (
        /* Content */
        <div className="relative z-10 min-h-screen flex flex-col">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-white/5 backdrop-blur-md"
          >
            <Link href="/" className="text-lg font-light tracking-tight text-white font-display hover:opacity-80 transition-opacity duration-200">
              Task Manager
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          </motion.header>

          <main className="max-w-3xl mx-auto w-full p-6 flex-1">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}