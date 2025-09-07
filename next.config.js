const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages部署配置
  basePath: process.env.NODE_ENV === 'production' ? '/sanpiekankan.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sanpiekankan.github.io/' : '',
  webpack: (config, { isServer }) => {
    // 在客户端构建中，将 Node.js 模块替换为空对象
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        sharp: false,
      };
    }
    return config;
  },
};

module.exports = withMDX(nextConfig)