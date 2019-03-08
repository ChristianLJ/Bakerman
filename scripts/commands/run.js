const l = require("../utils/log").withContext("run");
const exec = require('child_process').exec;

const TRUNCATION_LIMIT = 80;

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {boolean} inheritIo
 * @returns {Promise}
 */
module.exports = function run(command, args, inheritIo) {
  const cmd = `${command} ${args.join(" ")}`;
  l.info(`Spawning`);

  if (cmd.length < TRUNCATION_LIMIT) {
    l.info(cmd);
  } else {
    const chunks = Math.round(cmd.length / TRUNCATION_LIMIT) + 1;

    for (let i = 0; i < chunks; i++) {
      l.info(`${cmd.substr(i * TRUNCATION_LIMIT, TRUNCATION_LIMIT)}`);
    }
  }
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else if (stderr && stderr.length) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};
