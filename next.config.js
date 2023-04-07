const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    return {
      ...config,
      plugins: [...config.plugins, new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
    };
  },
};

module.exports = nextConfig;
