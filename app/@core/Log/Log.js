class Log {

    static debug(message, obj) {

    }

    static info(message, obj) {
        const color = "\x1b[36m";

        Log.log(message, obj, color);
    }

    static alert(message, obj) {
        const color = "\x1b[33m";

        Log.log(message, obj, color);
    }

    static error(message, obj) {

    }

    static log(message, obj, color) {
        const timestamp = `[${new Date().toISOString()}] `;

        if (message && !obj) {
            process.stdout.write(timestamp + message + "\n");
            //console.log(color, timestamp + message + "\x1b[0m");
        } else if (message && obj) {
            //console.log(color, timestamp + message + "\x1b[0m", obj);
            process.stdout.write(timestamp + message + "\n");
        }
    }

}

module.exports = Log;
