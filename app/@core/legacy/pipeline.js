const Environment = require('../Environment');
const Log = require("../Log/Log");

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

        return new Promise((resolve, reject) => {
            return runSteps(this.steps).then(() => {
                    if (Environment.getMode() === "PROD") {
                        Log.success(`Finished build for production. Elapsed time: ${new Date().getTime() - start} ms.`);

                        setTimeout(() => {
                            process.exit(0);
                        }, 1000);
                    } else {
                        Log.clear();
                        Log.success(`Built in: ${new Date().getTime() - start}ms.`);
                    }

                    resolve();
                }
            );
        });
    }
}

module.exports = Pipeline;
