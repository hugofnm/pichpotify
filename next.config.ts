import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['ts', 'tsx'],
  images: {
    remotePatterns: [new URL('https://i.scdn.co/**')],
  },
};

export default nextConfig;
