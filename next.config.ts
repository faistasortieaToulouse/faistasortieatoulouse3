import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'http', hostname: 'bilingue31.free.fr', pathname: '/**' },
      { protocol: 'https', hostname: 'secure.meetupstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
    ],
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
value: `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://discord.com https://translate.google.com https://maps.googleapis.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://translate.google.com https://maps.gstatic.com;
  img-src 'self' data: https: https://maps.gstatic.com;
  connect-src 'self' https://discord.com https://translate.google.com https://maps.googleapis.com https://www.googleapis.com;
  frame-src https://discord.com https://translate.google.com https://calendar.google.com https://www.google.com/maps;
  font-src 'self' https://fonts.gstatic.com;
`.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
