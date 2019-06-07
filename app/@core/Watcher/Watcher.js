const path = require("path");
const gaze = require("gaze");
const Log = require("../Log/Log");
const Pipeline = require("../legacy/pipeline");
const Environment = require('../Environment');
const styles = require("../legacy/steps/build/styles");
const typescript = require("../legacy/steps/build/typescript");
const chokidar = require('chokidar');
const minifyImages = require("../legacy/steps/build/minify_images");
const copy = require("../legacy/steps/build/copy");

class Watcher {
    watch() {
        //TODO: get path from config
        const configPath = path.resolve(process.cwd(), "src");
        chokidar.watch(configPath, {ignored: /(^|[\/\\])\../, ignoreInitial: true}).on('all', (event, filePath) => {
            if (event === "addDir") {
                return;
            }

            filePath = path.parse(filePath);
            const baseDir = process.cwd();
            const mode = Environment.getMode();

            let pipeline = new Pipeline();

            switch (filePath.ext) {
                case ".scss":
                    pipeline = pipeline.withStep(styles(baseDir, mode, false));
                    break;
                case ".ts":
                case ".tsx":
                case ".js":
                case ".jsx":
                    pipeline = pipeline.withStep(typescript(baseDir, mode, false));
                    break;
                case ".png":
                case ".jpg":
                case ".jpeg":
                case ".webp":
                case ".gif":
                    pipeline = pipeline.withStep(minifyImages(baseDir, mode, false));
                    break;
                case ".php":
                case ".html":
                    pipeline = pipeline.withStep(copy(baseDir, mode, false));
                    break;
            }

            pipeline.run();

        });
    }
}

module.exports = new Watcher();
