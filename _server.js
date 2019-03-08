const log = require("./scripts/utils/log");
const l = log.withContext("start");
const exec = require('child_process').exec;
const path = require('path');
const fs = require("fs");
const Bakerman = require("./scripts/utils/Bakerman");
let isApacheStarted = false;

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

exports.serve = function () {
    setTimeout(() => {
        l.log("Starting server");

        //exec("taskkill /f /im node.exe");

        const port = Bakerman.getApachePort();
        const url = 'http://localhost:' + port;
        const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
        exec(start + ' ' + url);

        getApachePath().then(apachePath => {
            const distPath = path.resolve("./dist");
            let configPath = path.resolve(__dirname, "configs/_temp_httpd.conf");

            let config = fs.readFileSync(configPath).toString();
            config = config.split("---CHANGEDIR---").join(distPath);
            config = config.split("---CHANGEPORT---").join(port);

            configPath = configPath.replace("_temp_httpd.conf", "active_httpd.conf");

            fs.writeFileSync(configPath, config);

            const cmd = apachePath + ' -f "' + configPath + '"';

            if(!isApacheStarted) {
                exec(cmd, (err, stdout, stderr) => {
                    if (err) {
                        l.error(err);
                    }

                    l.info(stderr);
                    l.info(stdout);
                });

                isApacheStarted = true;
            }
        });
    }, 1000);
};

