import "@kyso/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

};

export default nextConfig;
