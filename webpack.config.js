module.exports = {
  context: __dirname + "/app",
  entry: "./index.js",

  output: {
    filename: "index.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
