const crypto = require("crypto");
const read = require("../commands/read");

/**
 *
 * @param {string} str
 * @returns {string}
 */
function sha256(str) {
  return crypto
    .createHmac("sha256", "lvq")
    .update(str)
    .digest("hex");
}
module.exports.sha256 = sha256;

/**
 *
 * @param {string} target
 * @returns {Promise}
 */
function sha256file(target) {
  return read(target).then(data => sha256(data));
}
module.exports.sha256file = sha256file;
