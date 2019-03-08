const fs = require("fs");
const path = require('path');

class Bakerman {

    static getConfig() {
        const config = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString()).bakerman;
        if (!config) {
            return "NO CONFIG";
        }

        return config;
    }

    static getApachePort() {
        return this.getConfig().port;
    }

    static shouldCreateWebPImages() {
        return this.getConfig().createWebP;
    }

}

module.exports = Bakerman;
