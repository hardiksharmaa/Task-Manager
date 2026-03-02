"use client";

export default function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}