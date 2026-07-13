import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  // ponytail: add images.domains, headers (CSP) when ready for production
};

export default nextConfig;
