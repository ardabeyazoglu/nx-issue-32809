const { composePlugins, withNx } = require("@nx/webpack");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const skipTypeChecking = true;

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    skipTypeChecking: skipTypeChecking,
    target: "node",
  }), 
  (config) => {
    const plugins = [];
    for (const p of config.plugins) {
      if (p.constructor.name === "ForkTsCheckerWebpackPlugin") {
        plugins.push(
          // default one from nx was not using async: true (not sure if it's needed)
          new ForkTsCheckerWebpackPlugin({
            async: true,
            typescript: {
              memoryLimit: 2048,
              configFile: "./tsconfig.app.json",
              mode: "write-references",
            },
          }),
        );
      }
      else {
        plugins.push(p);
      }
    }

    return {
      ...config,
      module: {
        ...config.module,
      },
      entry: ["webpack/hot/poll?100", ...config.entry.main],
      externals: [
        nodeExternals({
          main: "./src/main.ts",
          tsConfig: "./tsconfig.app.json",
          assets: [],
          optimization: false,
          outputHashing: "none",
          sourceMap: true,
          skipTypeChecking: true,
          allowlist: ["webpack/hot/poll?100"],
          debug: true,
          verbose: true
        }),
      ],
      plugins: [
        ...plugins,
        new webpack.HotModuleReplacementPlugin({}),
        new webpack.WatchIgnorePlugin({
          paths: [/\.js$/, /\.d\.ts$/],
        })
      ],
    };
  });
