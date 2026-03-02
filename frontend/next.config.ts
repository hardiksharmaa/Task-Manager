import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    return backendUrl
      ? [
          {
            source: "/api/:path*",
            destination: `${backendUrl}/:path*`,
          },
        ]
      : [];
  },
};

export default nextConfig;
