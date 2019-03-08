const l = require("./utils/log").withContext("pipeline");

/**
 * @param {{ run: () => void }[]} steps
 * @return {Promise<any>}
 */
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

    /**
     *
     * @param {{ run: () => Promise<any>; }} step
     */
    withStep(step) {
        this.steps.push(step);

        return this;
    }

    /**
     * @return {Promise<any>}
     */
    run() {
        const start = new Date().getTime();
        l.info("Start");

        return runSteps(this.steps).then(() =>
            l.log(`Finished. Elapsed time: ${new Date().getTime() - start} ms`)
        );
    }
}

module.exports = Pipeline;
