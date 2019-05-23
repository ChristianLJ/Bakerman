const l = require("../../utils/log").withContext("typescript");
const fs = require("fs");
const hash = require("../../utils/hash");
const getBuildVars = require("../../utils/get-build-vars");
const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * @param {string} baseDir
 * @param {string} relativeFile
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, mode) {
    return {
        run() {
            l.info("Starting typescript compilation process in mode: " + mode);

            const webpackMode = mode === "DEV" ? "development" : "production";

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
                    entry: './src/app/app.ts',
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
                        l.error(JSON.stringify(stats.toJson()));
                        reject(err);
                        return;
                    }

                    getBuildVars("general.typescript", "").then(files => {
                        const file = files.in;
                        const outFile = files.out;

                        l.info(`Input: ${file}`);
                        l.info(`Output: ${outFile}`);

                        new Promise((resolve1, reject1) => {
                            hash.sha256file(file).then(hash => {
                                fs.readdir("./dist", function (error, files) {
                                    if (error) {
                                        reject(error);
                                    }
                                    resolve("");

                                });
                            });
                        });
                    });
                });
            });
        }
    };
};
