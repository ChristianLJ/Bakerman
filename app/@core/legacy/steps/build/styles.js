const sass = require("node-sass");
const {resolve} = require("path");
const Log = require("../../../Log/Log");
const write = require("../../commands/write");
const getBuildVars = require("../../utils/get-build-vars");

module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {
            const styles = getBuildVars().general.stylesheet;

            const file = resolve(baseDir, styles.in);
            const outFile = resolve(baseDir, styles.out);

            return new Promise((resolve, reject) => {

                if (mode === "DEV") {
                    Log.progress("Minifying and compiling .scss to .css in development mode with source maps.");

                    sass.render(
                        {
                            file,
                            outFile,
                            sourceMap: true
                        },
                        function (err, result) {
                            if (err) {
                                Log.error(err.formatted);
                                process.exit(1);
                            } else {
                                write(outFile, result.css.toString());
                                resolve({outFile: outFile, css: result.css.toString()});
                            }
                        }
                    );
                } else {
                    Log.progress("Minifying and compiling .scss to .css in production mode.");

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
        }
    };
};
