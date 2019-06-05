class Terminal {
    static setTitle(title) {
        if (process.platform === 'win32') {
            process.title = title;
        } else {
            process.stdout.write('\x1b]2;' + title + '\x1b\x5c');
        }
    }

    static centerText(string) {
        const length = string.length;
        const pad = (100 - length) / 2;

        for (let i = 0; i < pad; i++) {
            string = " " + string + " ";
        }

        return string;
    }

    static showLogo() {
        Terminal.setTitle("BAKERMAN");

        console.log(" ______        _       ___  ____   ________  _______     ____    ____       _       ____  _____  \n" +
            "|_   _ \\      / \\     |_  ||_  _| |_   __  ||_   __ \\   |_   \\  /   _|     / \\     |_   \\|_   _| \n" +
            "  | |_) |    / _ \\      | |_/ /     | |_ \\_|  | |__) |    |   \\/   |      / _ \\      |   \\ | |   \n" +
            "  |  __'.   / ___ \\     |  __'.     |  _| _   |  __ /     | |\\  /| |     / ___ \\     | |\\ \\| |   \n" +
            " _| |__) |_/ /   \\ \\_  _| |  \\ \\_  _| |__/ | _| |  \\ \\_  _| |_\\/_| |_  _/ /   \\ \\_  _| |_\\   |_  \n" +
            "|_______/|____| |____||____||____||________||____| |___||_____||_____||____| |____||_____|\\____| \n" +
            "                                                                                                 ");
    }
}

module.exports = Terminal;
