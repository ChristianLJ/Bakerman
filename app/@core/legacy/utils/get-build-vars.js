const path = require("path");

module.exports = function getBuildVars() {
    const configPath = path.resolve(process.cwd(), ".bakerman.json");
    return require(configPath);
};
