const l = require("../utils/log").withContext("cp");
const run = require("./run");
const fs = require("fs");
const ncp = require('ncp').ncp;
const {resolve} = require("path");

/**
 *
 * @param {string} source
 * @param {string} target
 * @param {boolean} recursively
 * @returns {Promise}
 */
module.exports = function cp(firstRun, baseDir, source, target) {
    ncp.limit = 16;
    const filter = /^(.(?!.*\.ts$|.*\.scss$|core|styles|app))*$/;

    source = resolve(baseDir, source);
    target = resolve(baseDir, target);

    return new Promise((resolve, reject) => {
        ncp(source, target, {filter: filter}, function (err) {
            if (err) {
                reject(err);
            }
            console.log("Successfully renamed file")
            resolve("Successfully renamed file");
        });
    });
};
