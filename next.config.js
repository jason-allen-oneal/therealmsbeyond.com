/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    const webpack = require("webpack");

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({ "process.env.FLUENTFFMPEG_COV": false })
    );

    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
