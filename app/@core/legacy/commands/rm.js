const l = require("../utils/log").withContext("rm");
const fs = require('fs-extra');
/**
 *
 * @param {string} target
 * @param {boolean} recursively
 * @returns {Promise}
 */
module.exports = function rm(target, recursively, mode) {
    if (mode === "PROD") {
        l.info("Deleting");
        l.info(target);

        if (target.includes("*")) {
            return Promise.reject(
                new Error("No support for wildcards in target! (For your own safety)")
            );
        }

        if (!fs.existsSync(target)) {
            return false;
        }

        fs.removeSync(target);
    } else {
        l.info("Skipping deletion since we're in DEV MODE!");
        return true;
    }
};
