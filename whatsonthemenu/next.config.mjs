/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed swcMinify as it's deprecated in Next.js 15
  // swcMinify: true,
  // Removed redirect that breaks routing to /Routes/*
  // async redirects() {
  //   return [
  //     {
  //       source: "/Routes/:path*",
  //       destination: "/:path*",
  //       permanent: false,
  //     },
  //   ];
  // },
  env: {
    API_KEY: process.env.API_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
  }
};

export default nextConfig;
