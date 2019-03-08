const l = require("../../utils/log").withContext("copy");
const cp = require("../../commands/cp");
const getBuildVars = require("../../utils/get-build-vars");

/**
 * @param {string} baseDir
 * @returns {{run: () => Promise }}
 */
module.exports = function run(baseDir, isUpdating) {
    return {
        run() {
            return getBuildVars("copy", []).then(targets => {
                l.info("Starting copy process");

                return cp(isUpdating, baseDir, targets.source, targets.distribution);
            });
        }
    };
};
