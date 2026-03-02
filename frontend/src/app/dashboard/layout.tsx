"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/tasks");
        setAuthorized(true);
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  if (!authorized) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <Image src="/dashboard.gif" alt="bg" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-sm text-white/40 animate-pulse">Checking authentication...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <Image
        src="/dashboard.gif"
        alt="Dashboard background"
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Content */}
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
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="text-sm text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Logout
          </button>
        </motion.header>

        <main className="max-w-3xl mx-auto w-full p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}