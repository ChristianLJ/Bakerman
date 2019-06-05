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
    const distAssetsFolder = getBuildVars().general.distFolder;

    return listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*`)
}

/**
 * @returns {Promise<string[]>}
 */
function getStyleDistFiles() {
    const distAssetsFolder = getBuildVars().general.distFolder;
    return listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*.css`)
}

/**
 * @returns {Promise<string[]>}
 */
function getJavascriptDistFiles() {
    const distAssetsFolder = getBuildVars().general.distFolder;
    return listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*.js`)
}

/**
 * @returns {Promise<string[]>}
 */
function getHtmlDistFiles() {
    const distAssetsFolder = getBuildVars().general.distFolder;
    return listFiles(`${trimEnd(distAssetsFolder, "/")}/**/*.php`)
}

/**
 * @returns {Promise<string[]>}
 */
function getHtmlSrcFiles() {
    const appFolder = getBuildVars().general.srcFolder;
    return listFiles(`${trimEnd(appFolder, "/")}/**/*.php`)
}


module.exports.listFiles = listFiles;
module.exports.getAssetDistFiles = getAssetDistFiles;
module.exports.getStyleDistFiles = getStyleDistFiles;
module.exports.getHtmlDistFiles = getHtmlDistFiles;
module.exports.getHtmlSrcFiles = getHtmlSrcFiles;
module.exports.getJavascriptDistFiles = getJavascriptDistFiles;
