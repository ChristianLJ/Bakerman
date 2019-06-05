const fs = require("fs");
const hash = require("../../utils/hash");
const getBuildVars = require("../../utils/get-build-vars");
const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Log = require("../../../Log/Log");

module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {
            const webpackMode = mode === "DEV" ? "development" : "production";

            Log.info("Transpiling code base using Webpack in " + webpackMode + " mode.");

            const productionPlugins = [];
            if (webpackMode === "production") {
                /*minimizerPlugins.push(new TerserPlugin({
                    exclude: /node_modules/,
                    parallel: true,
                    sourceMap: false, // Must be set to true if using source-maps in production
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                }),);*/
                productionPlugins.push(new BundleAnalyzerPlugin());
            }

            const compiler = webpack({
                    mode: webpackMode,
                    entry: './src/app/app.ts', //TODO: add path to config
                    module: {
                        rules: [
                            {
                                test: /\.tsx?$/,
                                exclude: /node_modules/,
                                loader: 'ts-loader'
                            }
                        ],
                    },
                    plugins: [
                        new webpack.optimize.LimitChunkCountPlugin({
                            maxChunks: 1,
                        }),
                    ].concat(productionPlugins),
                    resolve: {
                        modules: [
                            "node_modules",
                            path.resolve(__dirname, "./src/app")
                        ],
                        extensions: ['.js', '.jsx', '.tsx', '.ts', '.json']
                    },
                    output: {
                        filename: 'app.min.js',
                        path: path.resolve('./dist')
                    }
                }
            );

            return new Promise((resolve, reject) => {
                compiler.run(function (err, stats) {
                    if (err || stats.hasErrors()) {
                        Log.error(JSON.stringify(stats.toJson()));
                        reject(err);
                        return;
                    }

                    const typescript = getBuildVars().general.typescript;
                    const file = typescript.in;
                    const outFile = typescript.out;

                    new Promise((resolve1, reject1) => {
                        hash.sha256file(file).then(hash => {
                            fs.readdir("./dist", function (error, files) {
                                if (error) {
                                    reject(error);
                                }
                                resolve();

                            });
                        });
                    });
                });
            });
        }
    };
};
