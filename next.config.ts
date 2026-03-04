import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "trustworthy-owl-120.eu-west-1.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
