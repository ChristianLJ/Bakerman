const l = require("./utils/log").withContext("build");
const {createBuildPipeline} = require("./pipelines/build");

module.exports.run = function run(baseDir, isUpdating, mode) {
    const base = baseDir ? baseDir : "";

    l.info(`Build started with base directory ${base}`);
    l.log("");

    const pipeline = createBuildPipeline(base, isUpdating, mode);

    return pipeline.run()
};
