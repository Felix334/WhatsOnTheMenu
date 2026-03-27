/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),

  env: {
    API_KEY: process.env.API_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
  }
};

export default nextConfig;
