const l = require("../utils/log").withContext("mkdir");
const run = require("./run");
const fs = require("fs");
/**
 *
 * @param {string} path
 * @returns {Promise}
 */
module.exports = function mkdir(path) {
    if(fs.existsSync(path)) {
	  return false;
  }
  
  return run("mkdir", ["", '"' + path + '"']);
};
