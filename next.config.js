/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/neural-ai",
        destination: "/neural-ai",
      },
    ]
  },
}

module.exports = nextConfig
