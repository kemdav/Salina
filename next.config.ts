import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "salina.localhost",
    "acme.salina.localhost",
    "mysalinacorp.salina.localhost",
    "http://*.salina.localhost:3000"
  ],
};

export default nextConfig;
