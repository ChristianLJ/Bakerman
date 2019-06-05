const fs = require("fs");
const minify = require('html-minifier').minify;
const path = require('path');
const glob = require("glob");
const Log = require("../../../Log/Log");

/**
 * @param {string} baseDir
 * @param {string} relativeFile
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {
            return new Promise((resolve, reject) => {
                try {
                    if (mode === "DEV") {
                        resolve();
                        return;
                    }

                    Log.info("Minifying HTML.");

                    const directory = path.join(baseDir + "/dist/**/*.php");

                    glob(directory, {}, function (er, files) {
                        for (const file of files) {
                            const data = fs.readFileSync(file).toString();
                            const minified = minify(data, {
                                collapseWhitespace: true,
                                removeComments: true,
                                removeEmptyAttributes: true
                            });

                            fs.writeFileSync(file, minified);
                        }

                        resolve();
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    };
};
