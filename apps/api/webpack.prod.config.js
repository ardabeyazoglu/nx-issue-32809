const { composePlugins, withNx } = require("@nx/webpack");
const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("path");

const skipTypeChecking = true;

module.exports = composePlugins(
  withNx({ 
    skipTypeChecking: skipTypeChecking,
    target: "node",
  }), 
  (config) => {
    const plugins = [
      new NxAppWebpackPlugin({
        compiler: "tsc",
        main: "./src/main.ts",
        tsConfig: "./tsconfig.app.json",
        assets: [],
        memoryLimit: 2048,
        outputHashing: "none",
        optimization: false,
        generatePackageJson: true,
        sourceMap: true,
        skipTypeChecking: skipTypeChecking,
        progress: true,
        verbose: false,
        transformers: [
          /*
          {
            // https://nx.dev/nx-api/nest#nest-generators
            // this makes full type check with ts-loader even if skipTypeChecking is true
            // PROBLEM: it needs emitting the code (noEmit: false, emitDeclarationOnly: false), however then it conflicts with allowImportingTsExtensions
            // PROBLEM: however we need allowImportingTsExtensions in shared libraries, because Deno forces it :(
            name: "@nestjs/swagger/plugin",
            options: {
              dtoFileNameSuffix: [".dto.ts", ".entity.ts"],
              introspectComments: true,
            },
          },
          */
        ]
      })
    ];

    return {
      ...config,
      mode: "production",
      devtool: "source-map",
      plugins: [
        ...config.plugins, 
        ...plugins
      ],
      target: ["node22.11"],
      output: {
        path: join(__dirname, "../../dist/apps/api"),
        environment: {
          arrowFunction: true,
          const: true,
          destructuring: true,
          optionalChaining: true,
          bigIntLiteral: true,
          templateLiteral: true,
          asyncFunction: true,
          forOf: true,
          dynamicImport: true,
        },
      }
    };
  });
