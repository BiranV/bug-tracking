module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        "^/": {
          target: "http://localhost:9000",
        },
      },
    },
  },
};
