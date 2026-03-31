/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Allow pdfjs-dist to work with Next.js webpack
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
