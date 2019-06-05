const l = require("../utils/log").withContext("read");
const {readFile} = require("fs");
const prettySize = require("../utils/pretty-size");

/**
 *
 * @param {string} target
 * @returns {Promise<string>}
 */
module.exports = function read(target) {
    return new Promise((resolve, reject) => {
        readFile(target, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const size = prettySize(data);

                resolve(data);
            }
        });
    });
};
