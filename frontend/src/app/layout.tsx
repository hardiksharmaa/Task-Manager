import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Task-Manager",
  description: "Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} bg-white text-black font-body`}>
        <AuthProvider>
  {children}
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        border: "1px solid #e5e5e5",
        padding: "12px 16px",
        fontSize: "14px",
        background: "#fff",
        color: "#111",
      },
    }}
  />
</AuthProvider>
      </body>
    </html>
  );
}
