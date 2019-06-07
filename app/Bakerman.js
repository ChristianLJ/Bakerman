const prepare = require("./@core/legacy/steps/build/prepare");
const copy = require("./@core/legacy/steps/build/copy");
const assets = require("./@core/legacy/steps/build/assets");
const typescript = require("./@core/legacy/steps/build/typescript");
const styles = require("./@core/legacy/steps/build/styles");
const minifyHtml = require("./@core/legacy/steps/build/minify_html");
const minifyImages = require("./@core/legacy/steps/build/minify_images");
const Pipeline = require("./@core/legacy/pipeline");
const Environment = require('./@core/Environment');
const Server = require('./@core/Server');
const Terminal = require('./@core/Terminal/Terminal');
const Log = require('./@core/Log/Log');
const Watcher = require('./@core/Watcher/Watcher');

let firstRun = true;

class Bakerman {
    run() {
        Terminal.showLogo();

        if (Environment.getMode() === "PROD") {
            Log.progress("Starting build process for production.");
            this.buildProd();
        } else {
            Log.persistent("Development server running at http://localhost:3000");
            this.buildDevAndWatch();
        }
    }

    buildDevAndWatch() {
        this.build().then(() => {
            Watcher.watch();
        });
    }

    buildProd() {
        this.build();
    }

    build() {
        const baseDir = process.cwd();
        const mode = Environment.getMode();

        const pipeline = new Pipeline()
            .withStep(prepare(baseDir, mode, firstRun))
            .withStep(copy(baseDir, mode, firstRun))
            .withStep(minifyImages(baseDir, mode, firstRun))
            .withStep(typescript(baseDir, mode, firstRun))
            .withStep(styles(baseDir, mode, firstRun))
            .withStep(assets(baseDir, mode, firstRun))
            .withStep(minifyHtml(baseDir, mode, firstRun))
            .run();

        if (firstRun) {
            new Server().serve();
        }

        firstRun = false;

        return pipeline;
    }
}

module.exports = Bakerman;
