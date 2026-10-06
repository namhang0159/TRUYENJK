import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chỉ kích hoạt standalone cho Docker build, bỏ qua khi deploy trên Vercel
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
