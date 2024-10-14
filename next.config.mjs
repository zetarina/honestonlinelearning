/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true, // Enable source maps for production

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
