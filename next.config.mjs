/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/vibe-code-tests',
  assetPrefix: '/vibe-code-tests',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
