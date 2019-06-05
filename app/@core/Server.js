const log = require("./legacy/utils/log");
const l = log.withContext("start");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require("fs");
const getBuildVars = require("./legacy/utils/get-build-vars");
const Log = require("./Log/Log");

class Server {
    getServerExecutablePath() {
        const serverExecutablePath = "C:\\xampp\\apache\\bin\\httpd.exe";
        const serverExists = fs.existsSync(serverExecutablePath);

        return new Promise((resolve, reject) => {
            if (!serverExists) {
                reject("APACHE NOT FOUND");
            }

            resolve(serverExecutablePath);
        });
    }

    serve() {
        const port = getBuildVars().config.port;

        this.getServerExecutablePath().then(serverExecutablePath => {
            const distPath = path.resolve(process.cwd(), "dist");
            let configPath = path.resolve(__dirname, "../configs/_temp_httpd.conf");

            let config = fs.readFileSync(configPath).toString();
            config = config.split("---CHANGEDIR---").join(distPath);
            config = config.split("---CHANGEPORT---").join(port);

            configPath = configPath.replace("_temp_httpd.conf", "active_httpd.conf");

            fs.writeFileSync(configPath, config);

            const cmd = serverExecutablePath + ' -f "' + configPath + '"';

            setTimeout(() => {
                spawn("START /B " + cmd, [], {
                    shell: true,
                    stdio: "inherit",
                });

                Log.info("Server running at http://localhost:3000");

                exec('npx browser-sync start --proxy "localhost:7900" --files ' + distPath + '/**/*', (err, stdout, stderr) => {
                    if (err) {
                        l.error(err);
                    }
                });
            }, 2500);
        });
    };
}

module.exports = Server;


