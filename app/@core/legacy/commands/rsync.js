const run = require("./run");
const { trimEnd } = require("lodash");

/**
 *
 * @param {string} source
 * @param {string} remoteUser
 * @param {string} remoteHost
 * @param {string} remoteTarget
 * @param {string} sshIdentity
 */
module.exports = function rsync(
  source,
  remoteUser,
  remoteHost,
  remoteTarget,
  sshIdentity
) {
  const remoteArg = `${remoteUser}@${remoteHost}:${trimEnd(
    remoteTarget,
    "/"
  )}/`;

  // rsync -avzhe ssh --progress ./dist/ root@188.166.194.157:/var/www/html/ --delete
  return run("rsync", [
    "-avzhe",
    `"ssh -i ${sshIdentity}"`,
    "--progress",
    `${trimEnd(source, "/")}/`,
    remoteArg,
    "--delete"
  ]);
};
