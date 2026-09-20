/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    const backendPort = process.env.BACKEND_PORT || '8000';
    const backendHost = process.env.INTERNAL_API_URL || process.env.BACKEND_URL || `http://127.0.0.1:${backendPort}`;
    return [
      { source: '/api/:path*',     destination: `${backendHost}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backendHost}/uploads/:path*` },
      { source: '/docs',           destination: `${backendHost}/docs` },
      { source: '/health',         destination: `${backendHost}/health` },
      { source: '/openapi.json',   destination: `${backendHost}/openapi.json` },
    ];
  },
};

module.exports = nextConfig;
