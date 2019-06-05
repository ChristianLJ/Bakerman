const l = require("../../utils/log").withContext("prepare");
const getBuildVars = require("../../utils/get-build-vars");
const rimraf = require("rimraf");

module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {

            return new Promise((resolve, reject) => {
                if (mode === "DEV" && !firstRun) {
                    resolve();
                    return;
                }

                l.info("Starting pre-build process");

                const config = getBuildVars();

                for (const folder of config.prepare.deleteFolders) {
                    rimraf(folder, function () {
                        resolve();
                    });
                }
            });
        }

    };
}
