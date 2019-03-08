const l = require("../../utils/log").withContext("prepare");
const mkdir = require("../../commands/mkdir");
const rm = require("../../commands/rm");
const {resolve} = require("path");
const getBuildVars = require("../../utils/get-build-vars");
const rimraf = require('rimraf');

/**
 * @param {string} baseDir
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, isUpdating, mode) {
    return {
        run() {
            return getBuildVars(
                ["prepare.deleteFolders", "prepare.createFolders"],
                []
            ).then(([deleteFolders, createFolders]) => {
                l.info("Starting pre-build process");

                return Promise.resolve()
                    .then(() =>
                        Promise.all(
                            (!isUpdating) ? deleteFolders.map(folder => rm(resolve(baseDir, folder), true, mode)) : ''
                        )
                    )
                    .then(() =>
                        Promise.all(
                            createFolders.map(folder => mkdir(resolve(baseDir, folder)))
                        )
                    );
            });
        }
    };
};
