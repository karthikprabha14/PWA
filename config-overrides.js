const webpack = require("webpack");
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto":  require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),  // require.resolve("stream-browserify") can be polyfilled here if needed
    assert: false, // require.resolve("assert") can be polyfilled here if needed
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    os: false, // require.resolve("os-browserify") can be polyfilled here if needed
    "url": false, // require.resolve("url") can be polyfilled here if needed
    zlib: false, 
    util: false,
    "tls": false,
    "net": false // require.resolve("browserify-zlib") can be polyfilled here if needed
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};