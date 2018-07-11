const {
    copyToClipboard, logToTerminal, setNetwork, writeToFile
} = require('../utils')

module.exports = (options, callback) => {
    setNetwork(options.network)

    const transaction = callback()

    if (options.copy) {
        copyToClipboard(transaction)
    }

    if (options.log) {
        logToTerminal(transaction)
    }

    if (options.file) {
        writeToFile(transaction, options.file)
    }
}
