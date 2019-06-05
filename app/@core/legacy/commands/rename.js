const l = require("../utils/log").withContext("rename");
const fs = require("fs");
/**
 *
 * @param {string} source
 * @param {string} target
 * @returns {Promise}
 */
module.exports = function rename(source, target) {
    if (source.indexOf(".php") > -1) {
        return new Promise((resolve, reject) => {
            resolve("Successfully renamed file");
            return;
        });
    }

    return new Promise((resolve, reject) => {
        fs.rename(source, target, (err) => {
            if (err) {
                reject(err);
            }

            resolve("Successfully renamed file");
        });
    });
};
