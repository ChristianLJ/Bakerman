const getBuildVars = require("../../utils/get-build-vars");
const rimraf = require("rimraf");
const Log = require("../../../Log/Log");

module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {

            return new Promise((resolve, reject) => {
                if (mode === "DEV" && !firstRun) {
                    resolve();
                    return;
                }

                const config = getBuildVars();

                Log.progress("Removing old ./dist folder.");

                for (const folder of config.prepare.deleteFolders) {
                    rimraf(folder, function () {
                        resolve();
                    });
                }
            });
        }

    };
}
