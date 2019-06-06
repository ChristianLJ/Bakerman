const prepare = require("../steps/build/prepare");
const copy = require("../steps/build/copy");
const assets = require("../steps/build/assets");
const typescript = require("../steps/build/typescript");
const styles = require("../steps/build/styles");
const minifyHtml = require("../steps/build/minify_html");
const minifyImages = require("../steps/build/minify_images");
const Pipeline = require("../pipeline");

module.exports.createBuildPipeline = function createBuildPipeline(baseDir, isUpdating, mode) {
    return new Pipeline()
        .withStep(prepare(baseDir, isUpdating, mode))
        .withStep(copy(baseDir, isUpdating))
        .withStep(minifyImages(baseDir, mode))
        .withStep(typescript(baseDir, mode))
        .withStep(styles(baseDir, mode))
        .withStep(assets(baseDir, mode))
        .withStep(minifyHtml(baseDir, mode));
};
