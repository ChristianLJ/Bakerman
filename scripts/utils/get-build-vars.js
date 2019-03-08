const getVars = require("./get-vars");

/**
 * @param {string|string[]} path
 * @param {any} defaultValue
 * @returns {Promise<any>}
 */
module.exports = function getBuildVars(path, defaultValue) {
  return getVars("build-vars.json", path, defaultValue);
};
