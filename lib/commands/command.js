const { copyToClipboard, logToTerminal, setNetwork, writeToFile } = require("../utils");

module.exports = (options, callback) => {
    setNetwork(options.network);

    const data = callback();

    if (options.copy) {
        copyToClipboard(data);
    }

    if (options.log) {
        logToTerminal(data);
    }

    if (options.file) {
        writeToFile(data, options.file);
    }
};
