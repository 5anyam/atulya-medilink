import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'cms.atulyamedilinkpvtltd.com' },
      { protocol: 'https', hostname: 'atulyamedilinkpvtltd.com' },
      { protocol: 'https', hostname: 'atulyamedilinkpvtltd.shop' },
      { protocol: 'https', hostname: 'cms.atulyamedilinkpvtltd.shop' },
      { protocol: 'https', hostname: 'yellow-chamois-808194.hostingersite.com' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
