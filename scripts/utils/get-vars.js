const { resolve } = require("path");
const { trimEnd, get } = require("lodash");
const glob = require("glob");

/**
 *
 * @param {string} pattern
 * @returns {Promise<string[]>}
 */
function listFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(
      pattern,
      {
        nodir: true
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      }
    );
  });
}

/**
 *
 * @param {string} varsFile
 * @param {number} safetyCount
 * @param {string} directory
 */
function _getBuildVars(varsFile, safetyCount, directory) {
  if (safetyCount === 0) {
    return undefined;
  }

  const dir = trimEnd(directory ? directory : __dirname, "/");

  return listFiles(`${dir}/*`)
    .then(files => files.find(str => str.includes(varsFile)))
    .then(
      buildVars =>
        buildVars
          ? buildVars
          : _getBuildVars(varsFile, safetyCount - 1, resolve(dir, "../"))
    );
}

/**
 *
 * @param {object} vars
 * @param {string} path
 * @param {any} defaultValue
 */
function _get(vars, path, defaultValue) {
  if (!path) {
    return vars;
  }

  const getter = p => {
    const value = get(vars, p, defaultValue);

    if (!value) {
      return defaultValue;
    }

    return value;
  };

  return Array.isArray(path) ? path.map(p => getter(p)) : getter(path);
}

/**
 * @param {string} varsFile
 * @param {string|string[]} path
 * @param {any} defaultValue
 * @returns {Promise<any>}
 */
module.exports = function getVars(varsFile, path, defaultValue) {
  return _getBuildVars(varsFile, 3).then(result => {
    if (result) {
      return Promise.resolve(require(result)).then(vars =>
        _get(vars, path, defaultValue)
      );
    } else {
      return Promise.reject(
        new Error("Unable to locate vars.json file.")
      );
    }
  });
};
