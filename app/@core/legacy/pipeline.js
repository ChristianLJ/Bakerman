const l = require("./utils/log").withContext("pipeline");
const Environment = require('../Environment');

function runSteps(steps) {
    if (steps.length === 0) {
        return;
    }

    const step = steps.shift();

    return step.run().then(() => runSteps(steps));
}

class Pipeline {
    constructor() {
        this.steps = [];
    }

    withStep(step) {
        this.steps.push(step);

        return this;
    }

    run() {
        const start = new Date().getTime();
        l.info("Start");

        return runSteps(this.steps).then(() => {
                l.log(`Finished. Elapsed time: ${new Date().getTime() - start} ms`);
                if (Environment.getMode() === "PROD") {
                    setTimeout(() => {
                        process.exit(0);
                    }, 1000);
                }
            }
        );
    }
}

module.exports = Pipeline;
