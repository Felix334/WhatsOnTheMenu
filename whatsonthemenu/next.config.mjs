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
};

export default nextConfig;
