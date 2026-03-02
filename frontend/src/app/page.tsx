"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-5"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-extralight tracking-tight text-white font-display"
          >
            Task Manager
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg md:text-xl text-white/70 max-w-md mx-auto"
          >
            Organize your work. Focus on what matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex gap-4 justify-center pt-4"
          >
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="border border-white/40 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border border-white/40 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-white/10 hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom fade text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 text-xs text-white/30 tracking-widest uppercase"
        >
          Built with Next.js &bull; TypeScript &bull; Prisma
        </motion.p>
      </div>
    </main>
  );
}