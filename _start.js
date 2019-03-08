const log = require("./scripts/utils/log");
const l = log.withContext("start");
const {spawn} = require("child_process");
const gaze = require("gaze");
const liveReload = require("livereload");
const buildProcess = require("./scripts/build");
const phpServer = require("./_server");
let isServerCreated = false;

exports.build = function (isUpdating, mode) {
    isUpdating = false; //OVERRIDE

    l.info("Running build");

    const startTime = new Date().getMilliseconds();

    return buildProcess.run(process.cwd(), isUpdating, mode)
        .then(result => {

            if (mode === "DEV") {
                try {
                    if (!isServerCreated) {
                        liveReload.createServer({port: 4202, debug: true});
                        isServerCreated = true;
                    }

                    livereloadServer.refresh("./dist/index.php");
                } catch (e) {

                }
            }

            l.info("Build finished, dumping result...");

            l.info("----- DUMP START -----");
            if (result) {
                result
                    .toString()
                    .split("\r\n")
                    .map(str => str.split("\n"))
                    .reduce((sum, current) => [...sum, ...current], [])
                    .forEach(str => console.log(str));
            }
            const endTime = new Date().getMilliseconds();
            l.info("TOOK " + (endTime - startTime) + " milliseconds to compile!");
            l.info("------ DUMP END ------");
        })
        .catch(err => {
            l.info("Build finished with error: " + err);
            l.error(err);
        });
};

exports.watch = function (mode) {
    l.info("watching files");

    gaze(["./src/**/*"], (err, watcher) => {
        if (err) {
            l.error(err);

            process.exit(-1);
        }

        watcher.on('all', (event, filepath) => {
            l.info(filepath + ' was ' + event);
            this.build(true, mode);
        });
    });
};

exports.start = function (mode) {
    if (mode === "DEV") {
        phpServer.serve();

        l.log("Starting build server in mode: " + mode);

        const server = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'server']);

        server.stdout.on("data", chunk =>
            log.withContext("http-server").info(chunk.toString())
        );
        l.log("Server started.");
    }

    this.build(false, mode).then(() => {
        l.info("BUILD FINISHED");
        if (mode === "DEV") {
            this.watch(mode);
        } else {
            process.exit();
        }
    });
};