import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob (product images / slips)
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // LINE content (profile pictures, message media)
      { protocol: 'https', hostname: 'profile.line-scdn.net' },
      { protocol: 'https', hostname: 'obs.line-scdn.net' },
    ],
  },
};

export default nextConfig;
