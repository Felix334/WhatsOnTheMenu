/** @type {import('next').NextConfig} */
const nextConfig = {
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
