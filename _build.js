const build = require("./scripts/build");

try {
  build.run(process.cwd());
} catch (e) {
  console.error(e);
}
