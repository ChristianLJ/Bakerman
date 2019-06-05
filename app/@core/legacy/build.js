const l = require("./utils/log").withContext("build");
const {createBuildPipeline} = require("./pipelines/build");

module.exports.run = function run(baseDir, isUpdating, mode) {
    const base = baseDir ? baseDir : "";

    const pipeline = createBuildPipeline(base, isUpdating, mode);

    return pipeline.run()
};
