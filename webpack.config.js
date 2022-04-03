// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  plugins: [],
  context: __dirname + "/app",
  entry: "./index.js",

  output: {
    filename: "index.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // alias: { process: “os/os-browerify/browser” },
    fallback: {
      // fs: false,
      // os: require.resolve("os-browserify/browser"),
      // path: require.resolve("path-browserify"),
    },
  },
};
