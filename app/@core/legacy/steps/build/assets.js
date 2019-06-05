const {resolve} = require("path");
const {sha256file} = require("../../utils/hash");
const rename = require("../../commands/rename");
const getBuildVars = require("../../utils/get-build-vars");
const {getAssetDistFiles, getStyleDistFiles, getHtmlDistFiles, getJavascriptDistFiles} = require("../../utils/list-files");
const {replaceInFile} = require("../../utils/replace-in-file");
const Log = require("../../../Log/Log");

/**
 *
 * @param {string} filename
 * @param {string} hash
 * @returns {string}
 */
function getNewFileName(filename, hash) {
    const filenameParts = filename.split(".");
    const extension = filenameParts.pop();

    return `${filenameParts.join(".")}.${hash}.${extension}`;
}

/**
 *
 * @param {string[]} files
 * @param {string[]} extensionExceptions
 * @returns {Promise<{ file: string; outFile: string; hash: string; }[]>}
 */
function calculateFileHashes(files, extensionExceptions) {
    return Promise.all(
        files
            .filter(
                file => !extensionExceptions.some(ext => file.split(".").pop() === ext)
            )
            .map(file =>
                sha256file(file).then(hash => ({
                    file,
                    outFile: getNewFileName(file, hash),
                    hash
                }))
            )
    );
}

/**
 *
 * @param {string[]} files
 * @param {string[]} extensions
 * @returns {Promise<{ file: string; outFile: string; hash: string; }[]>}
 */
function calculateFileHashesForExtensions(files, extensions) {
    return Promise.all(
        files
            .filter(file => extensions.some(ext => file.split(".").pop() === ext))
            .map(file =>
                sha256file(file).then(hash => ({
                    file,
                    outFile: getNewFileName(file, hash),
                    hash
                }))
            )
    );
}

/**
 *
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 * @param {string[]} extensionExceptions
 * @returns {Promise<{ file: string; outFile: string; hash: string; }[]>}
 */
function renameFiles(files, extensionExceptions) {
    return Promise.all(
        files
            .filter(
                ({file}) =>
                    !extensionExceptions.some(ext => file.split(".").pop() === ext)
            )
            .map(({file, outFile}) => rename(file, outFile))
    ).then(() => files);
}

/**
 *
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 * @param {string[]} extensions
 * @returns {Promise<{ file: string; outFile: string; hash: string; }[]>}
 */
function renameFilesForExtensions(files, extensions) {
    return Promise.all(
        files
            .filter(({file}) =>
                extensions.some(ext => file.split(".").pop() === ext)
            )
            .map(({file, outFile}) => rename(file, outFile))
    ).then(() => files);
}

/**
 * @param {string} file
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 * @returns {Promise}
 */
function replaceAssetReferencesInFile(target, files) {
    const replacementMap = files.reduce(
        (result, entry) => ({
            ...result,
            [entry.file.split("/").pop()]: entry.outFile.split("/").pop()
        }),
        {}
    );

    return replaceInFile(target, replacementMap);
}

/**
 * @param {string} baseDir
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 * @param {string[]} extensionExceptions
 * @returns {Promise}
 */
function replaceInHtml(baseDir, files, extensionExceptions) {
    return getHtmlDistFiles(baseDir).then(htmlFiles =>
        Promise.all(
            htmlFiles.map(file =>
                replaceAssetReferencesInFile(
                    file,
                    files.filter(
                        ({file}) =>
                            !extensionExceptions.some(ext => file.split(".").pop() === ext)
                    )
                )
            )
        )
    );
}

/**
 * @param {string} baseDir
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 * @param {string[]} extensions
 * @returns {Promise}
 */
function replaceInHtmlForExtensions(baseDir, files, extensions) {
    return getHtmlDistFiles(baseDir).then(htmlFiles =>
        Promise.all(
            htmlFiles.map(file =>
                replaceAssetReferencesInFile(
                    file,
                    files.filter(({file}) =>
                        extensions.some(ext => file.split(".").pop() === ext)
                    )
                )
            )
        )
    );
}

/**
 *
 * @param {string} assetsFolder
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 */
function replaceInStyles(files) {
    const general = getBuildVars().general;

    return getStyleDistFiles(general.distFolder).then(styleFiles =>
        Promise.all(
            styleFiles.map(file => replaceAssetReferencesInFile(file, files))
        )
    );
}

/**
 *
 * @param {string} assetsFolder
 * @param {{ file: string; outFile: string; hash: string; }[]} files
 */
function replaceInJavascript(files) {
    const general = getBuildVars().general;

    getJavascriptDistFiles(general.distFolder).then(styleFiles =>
        Promise.all(
            styleFiles.map(file => replaceAssetReferencesInFile(file, files))
        )
    )
}

/**
 * @param {string} baseDir
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {
            const dist = getBuildVars().general.distFolder;

            const distFolder = resolve(baseDir, dist);
            if (mode === "DEV") {
                return new Promise((resolve, reject) => {
                    resolve("");
                });
            }

            Log.info("Hashing all assets and replacing entries in project files.");

            return getAssetDistFiles().then(assets => {
                return calculateFileHashes(assets, ["css"])
                    .then(result => renameFiles(result, ["css"]))
                    .then(result =>
                        Promise.all([
                            replaceInHtml(distFolder, result, ["css"]),
                            replaceInStyles(result),
                            replaceInJavascript(result)
                        ])
                    )
                    .then(() => calculateFileHashesForExtensions(assets, ["css"]))
                    .then(result => renameFilesForExtensions(result, ["css"]))
                    .then(result =>
                        replaceInHtmlForExtensions(distFolder, result, ["css"])
                    );
            });
        }
    };
};
