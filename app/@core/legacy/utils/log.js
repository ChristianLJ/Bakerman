/**
 *
 * @param {'log' | 'info' | 'warn' | 'trace' | 'error'} type
 * @param {...any} args
 */
function _log(type, ...args) {
    const timestamp = `[${new Date().toISOString()}]`;

    switch (type) {
        case "log":
            console.log(timestamp, ...args);
            break;
        case "info":
            console.info(timestamp, ...args);
            break;
        case "warn":
            console.warn(timestamp, ...args);
            break;
        case "trace":
            console.trace(timestamp, ...args);
            break;
        case "error":
            console.error(timestamp, ...args);
            break;
    }
}

/**
 *
 * @param {string} message
 * @param {any} extra
 * @param  {...any} args
 */
function log(message, ...args) {
    _log("log", message, ...args);
}

/**
 *
 * @param {string} message
 * @param {any} extra
 * @param  {...any} args
 */
function info(message, ...args) {
    _log("info", message, ...args);
}

/**
 *
 * @param {string} message
 * @param {any} extra
 * @param  {...any} args
 */
function warn(message, ...args) {
    _log("warn", message, ...args);
}

/**
 *
 * @param {string} message
 * @param {any} extra
 * @param  {...any} args
 */
function trace(message, ...args) {
    _log("trace", message, ...args);
}

/**
 *
 * @param {string} message
 * @param {any} extra
 * @param  {...any} args
 */
function error(message, ...args) {
    _log("error", message, ...args);
}

/**
 *
 * @param {string} context
 * @return {{log: (message, ...args) => void; info: (message, ...args) => void; warn: (message, ...args) => void; trace: (message, ...args) => void; error: (message, ...args) => void; }}
 */
function withContext(context) {
    return {
        log: (message, ...args) => log(`[${context}]`, message, ...args),
        info: (message, ...args) => info(`[${context}]`, message, ...args),
        warn: (message, ...args) => warn(`[${context}]`, message, ...args),
        trace: (message, ...args) => trace(`[${context}]`, message, ...args),
        error: (message, ...args) => error(`[${context}]`, message, ...args),
        withContext: ctx => withContext(ctx)
    };
}

const publicApi = {
    withContext,
    log,
    info,
    warn,
    trace,
    error
};

module.exports = publicApi;
