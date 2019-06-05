class Environment {
    static getMode() {
        let mode = "PROD";

        if (process.argv.indexOf("--dev") > -1) {
            mode = "DEV";
        }
        if (process.argv.indexOf("--prod") > -1) {
            mode = "PROD";
        }

        return mode;
    }
}

module.exports = Environment;
