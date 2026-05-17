import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  experimental: {
    prefetchInlining: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
