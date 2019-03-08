const sass = require("node-sass");
const {resolve} = require("path");
const l = require("../../utils/log").withContext("styles");
const write = require("../../commands/write");
const getBuildVars = require("../../utils/get-build-vars");

/**
 * @param {string} baseDir
 * @param {string} relativeFile
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, mode) {
    return {
        run() {
            l.info("Starting styles compilation process in mode: " + mode);

            return getBuildVars("general.stylesheet", "").then(stylesheets => {
                const file = resolve(baseDir, stylesheets.in);
                const outFile = resolve(baseDir, stylesheets.out);

                return new Promise((resolve, reject) => {
                    l.info(`Input: ${file}`);
                    l.info(`Output: ${outFile}`);

                    if (mode === "DEV") {
                        sass.render(
                            {
                                file,
                                outFile,
                                sourceMap: true
                            },
                            function (err, result) {
                                if (err) {
                                    reject(new Error(err.toString()));
                                } else {
                                    write(outFile, result.css.toString());
                                    resolve({outFile: outFile, css: result.css.toString()});
                                }
                            }
                        );
                    } else {
                        sass.render(
                            {
                                file,
                                outFile,
                                sourceMap: false,
                                outputStyle: "compressed"
                            },
                            function (err, result) {
                                if (err) {
                                    reject(new Error(err.toString()));
                                } else {
                                    write(outFile, result.css.toString());
                                    resolve({outFile: outFile, css: result.css.toString()});
                                }
                            }
                        );
                    }
                });
            });
        }
    };
};
