const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';

/** @type {import('next').NextConfig} */
module.exports = {
  // Browser calls /api/... on the Next.js domain; Next forwards to PHP.
  // Same origin = the admin session cookie just works (no CORS / SameSite issues).
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND}/api/:path*` },
      { source: '/uploads/:path*', destination: `${BACKEND}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [{ protocol: new URL(BACKEND).protocol.replace(':', ''), hostname: new URL(BACKEND).hostname, port: new URL(BACKEND).port }],
  },
};
