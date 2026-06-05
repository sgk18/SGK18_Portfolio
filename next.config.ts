import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Required for Prisma + libsql in Next.js:
  // prevents bundling native node modules that need to stay server-side
  serverExternalPackages: ["@prisma/client", "@libsql/client"],
};

export default nextConfig;
