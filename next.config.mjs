import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const createNextConfig = (phase) => {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    // Keep dev artifacts isolated so `next build` does not corrupt `next dev`.
    distDir: isDevServer ? ".next-dev" : ".next",
    webpack: (config) => {
      // Allow pdfjs-dist to work with Next.js webpack
      config.resolve.alias.canvas = false;
      return config;
    },
  };
};

export default createNextConfig;
