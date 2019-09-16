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

                    Log.progress("Minifying HTML.");

                    const directory = path.join(baseDir + "/dist/**/*.php");

                    glob(directory, {}, function (er, files) {
                        for (const file of files) {
                            const data = fs.readFileSync(file).toString();
                            const minified = minify(data, {
                                collapseWhitespace: true,
                                removeComments: true,
                                removeEmptyAttributes: true
                            });

                            //TODO: Add array in config file with names on blacklisted files
                            if(file.indexOf('sitemap') < -1 && file.indexOf("atom") < -1 && file.indexOf("rss") < -1) {
                                fs.writeFileSync(file, minified);
                            }
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
