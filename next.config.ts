import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'sachdevamedline.com' },
      { protocol: 'https', hostname: 'cms.sachdevamedline.com' },
      { protocol: 'https', hostname: 'cms.amraj.in' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'atulyamedilinkpvtltd.shop' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
