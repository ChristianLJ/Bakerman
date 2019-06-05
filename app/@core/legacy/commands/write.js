const l = require("../utils/log").withContext("write");
const { writeFile } = require("fs");
const prettySize = require("../utils/pretty-size");

/**
 *
 * @param {string} target
 * @param {string} data
 * @returns {Promise}
 */
module.exports = function write(target, data) {
  const size = prettySize(data);

  return new Promise((resolve, reject) => {
    
    
    
    writeFile(
      target,
      data,
      {
        encoding: "utf-8"
      },
      err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};
