class Log {

    static debug(message, obj) {

    }

    static info(message, obj) {
        const colors = ["\x1b[36m"];

        Log.log(message, obj, colors);
    }

    static error(message, obj) {

    }

    static log(message, obj, colors) {
        const timestamp = `[${new Date().toISOString()}] `;

        if (message && !obj) {
            console.log(colors[0], timestamp + message + "\x1b[0m");
        } else if (message && obj) {
            console.log(colors[0], timestamp + message + "\x1b[0m", obj);
        }
    }

}

module.exports = Log;
