/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/cursor-battle',
  assetPrefix: '/cursor-battle',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
