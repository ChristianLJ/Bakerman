const fs = require("fs");
const minify = require('html-minifier').minify;
const path = require('path');
const glob = require("glob");
const l = require("../../utils/log").withContext("minify-html");

/**
 * @param {string} baseDir
 * @param {string} relativeFile
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, mode) {
    return {
        run() {
            return new Promise((resolve, reject) => {
                try {
                    if (mode === "DEV") {
                        resolve();
                        return;
                    }

                    l.info("Minifying html")
                    const directory = path.join(baseDir + "/dist/**/*.php");

                    glob(directory, {}, function (er, files) {
                        for (const file of files) {
                            l.info("Minifing file: " + file);
                            const data = fs.readFileSync(file).toString();
                            const minified = minify(data, {
                                collapseWhitespace: true,
                                removeComments: true,
                                removeEmptyAttributes: true
                            });

                            fs.writeFileSync(file, minified);
                            l.info("Wrote minified data to: " + file);
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
