/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true, 

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
