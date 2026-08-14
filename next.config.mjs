/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal self-contained build for Docker deployment.
  // Only the files required to run the app are copied to `.next/standalone`.
  output: 'standalone',

  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      // DevFlow API — user avatars uploaded to the backend
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.devflow.app' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
