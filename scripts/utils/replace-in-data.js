const l = require("../utils/log").withContext("replace-in-data");
const {basename} = require("path");

/**
 *
 * @param {string} data
 * @param {{[key: string]: string}} keyValueMap
 * @returns {Promise<string>}
 */
function replaceInData(data, keyValueMap) {
    if ((Object.keys(keyValueMap)[0]).indexOf(".php") > -1) {
        return new Promise((resolve, reject) => {
            resolve();
            return;
        })
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const result = Object.keys(keyValueMap)
                    .map(key => ({key, value: keyValueMap[key]}))
                    .reduce((result, kv) => {
                        const regex = new RegExp(kv.key, "g");
                        const matches = result.match(regex);
                        if (matches && matches.length > 0) {
                            l.info(`Found ${matches.length} matches of "${kv.key}"`);
                        }

                        return result.replace(regex, kv.value);
                    }, data);

                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, 0);
    });
}

module.exports.replaceInData = replaceInData;
