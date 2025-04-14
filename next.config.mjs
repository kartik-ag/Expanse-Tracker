/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    // Dangerously ignore TypeScript errors
    ignoreBuildErrors: true
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true
  }
};

export default nextConfig; 