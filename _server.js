const log = require("./scripts/utils/log");
const l = log.withContext("start");
const exec = require('child_process').exec;
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require("fs");
const Bakerman = require("./scripts/utils/Bakerman");

function getApachePath() {
    const xamppPath = "C:\\xampp\\apache\\bin\\httpd.exe";
    let apachePath;

    if (fs.existsSync(xamppPath)) {
        apachePath = xamppPath;
    }

    return new Promise((resolve, reject) => {
        if (apachePath == null) {
            reject("APACHE NOT FOUND");
        }

        resolve(apachePath);
    });
}

const isRunning = (query) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' :
            cmd = `tasklist`;
            break;
        case 'darwin' :
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux' :
            cmd = `ps -A`;
            break;
        default:
            break;
    }
    const stdout = spawnSync(cmd);
    return stdout.toLowerCase().indexOf(query.toLowerCase()) > -1;
};

exports.serve = function () {
    if (!isRunning('httpd.exe')) {
        l.log("Starting server");

        const port = Bakerman.getApachePort();
        const url = 'http://localhost:' + port;
        const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
        spawn(start + ' ' + url);

        getApachePath().then(apachePath => {
            const distPath = path.resolve("./dist");
            let configPath = path.resolve(__dirname, "configs/_temp_httpd.conf");

            let config = fs.readFileSync(configPath).toString();
            config = config.split("---CHANGEDIR---").join(distPath);
            config = config.split("---CHANGEPORT---").join(port);

            configPath = configPath.replace("_temp_httpd.conf", "active_httpd.conf");

            fs.writeFileSync(configPath, config);

            const cmd = apachePath + ' -f "' + configPath + '"';

            spawn(cmd, (err, stdout, stderr) => {
                if (err) {
                    l.error(err);
                }

                l.info(stderr);
                l.info(stdout);
            });
        });
    }
};

