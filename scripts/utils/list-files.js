const glob = require("glob");
const getBuildVars = require("./get-build-vars");
const {trimEnd} = require("lodash");

/**
 *
 * @param {string} pattern
 * @returns {Promise<string[]>}
 */
function listFiles(pattern) {
    return new Promise((resolve, reject) => {
        glob(
            pattern,
            {
                nodir: true
            },
            (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            }
        );
    });
}

/**
 * @returns {Promise<string[]>}
 */
function getAssetDistFiles() {
    return getBuildVars("general.distFolder", "").then(distAssetsFolder =>
        listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*`)
    );
}

/**
 * @returns {Promise<string[]>}
 */
function getStyleDistFiles() {
    return getBuildVars("general.distFolder", "").then(distAssetsFolder =>
        listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*.css`)
    );
}

/**
 * @returns {Promise<string[]>}
 */
function getJavascriptDistFiles() {
    return getBuildVars("general.distFolder", "").then(distAssetsFolder =>
        listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*.js`)
    );
}

/**
 * @returns {Promise<string[]>}
 */
function getHtmlDistFiles() {
    return getBuildVars("general.distFolder", "").then(distFolder =>
        listFiles(`${trimEnd(distFolder, "/")}/**/*.php`)
    );
}

/**
 * @returns {Promise<string[]>}
 */
function getHtmlSrcFiles() {
    return getBuildVars("general.srcFolder", "").then(appFolder =>
        listFiles(`${trimEnd(appFolder, "/")}/**/*.php`)
    );
}


module.exports.listFiles = listFiles;
module.exports.getAssetDistFiles = getAssetDistFiles;
module.exports.getStyleDistFiles = getStyleDistFiles;
module.exports.getHtmlDistFiles = getHtmlDistFiles;
module.exports.getHtmlSrcFiles = getHtmlSrcFiles;
module.exports.getJavascriptDistFiles = getJavascriptDistFiles;
