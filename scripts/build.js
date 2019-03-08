const l = require("./utils/log").withContext("build");
const { createBuildPipeline } = require("./pipelines/build");

function handleError(error) {
  l.error(error);

  return Promise.resolve(-1);
}

/**
 * @param {string} baseDir
 * @returns {Promise}
 */
module.exports.run = function run(baseDir, isUpdating, mode) {
  const base = baseDir ? baseDir : "";

  l.info(`Build started with base directory ${base}`);
  l.log("");

  const pipeline = createBuildPipeline(base, isUpdating, mode);

  return pipeline
    .run()
    //.catch(error => handleError(error))
    //.then(exitCode => process.exit(exitCode));
};
