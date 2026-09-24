import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images uploaded through /admin live in this project's Vercel Blob store.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Admin uploads are resized in the browser first (to ~0.3 MB), so this
      // is headroom, and it stays under Vercel's 4.5 MB request cap.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
