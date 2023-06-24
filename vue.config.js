const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/main.scss";`,
      },
    },
  },
  configureWebpack: {
    resolve: {
      modules: [
        "node_modules", // Include the default 'node_modules' directory
      ],
    },
  },
});
