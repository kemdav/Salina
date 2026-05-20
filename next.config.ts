import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeping this for your current tenants since you mentioned it works
  allowedDevOrigins: [
    "salina.localhost",
    "acme.salina.localhost",
    "mysalinacorp.salina.localhost",
    "*.salina.localhost"
  ],
  // This is the official Next.js 14+ setting that fully supports wildcards for Server Actions!
  experimental: {
    serverActions: {
      allowedOrigins: [
        "salina.localhost:3000",
        "*.salina.localhost:3000"
      ]
    }
  }
};

export default nextConfig;
