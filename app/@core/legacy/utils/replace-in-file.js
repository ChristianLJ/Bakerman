const read = require("../commands/read");
const write = require("../commands/write");
const l = require("../utils/log").withContext("replace-in-file");
const {basename} = require("path");
const {replaceInData} = require("./replace-in-data");

/**
 * @param {string} file
 * @param {{[key: string]: string}} keyValueMap
 * @returns {Promise}
 */
function replaceInFile(target, keyValueMap) {
    for (const property in keyValueMap) {
        if (keyValueMap.hasOwnProperty(property)) {
            if (property.indexOf(".php") > -1) {
                delete keyValueMap[property];
            }
        }
    }

    return read(target)
        .then(data => {
            return replaceInData(data, keyValueMap)
        })
        .then(result => {
            return write(target, result)
        });
}

module.exports.replaceInFile = replaceInFile;
